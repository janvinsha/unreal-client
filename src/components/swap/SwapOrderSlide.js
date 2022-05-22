import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import BN from 'bignumber.js';
import * as Sentry from '@sentry/react';
import TokenIconBalanceGroupView from '../TokenIconBalanceGroupView';
import TokenSwapDistribution from './TokenSwapDistribution';
import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import SwapFn from '../../utils/swapFn';

export default class SwapOrderSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculatingSwap: false,
      errored: false,
      errorMsg: false,
      errorDetails: false,
    };

    this.calculatingSwapTimestamp = Date.now();

 

  fetchSwapEstimate(origFromAmount, timeNow, attempt, cb) {
    var fromAmount = origFromAmount;

    if (!attempt) {
      attempt = 0;
    } else if (attempt > window.MAX_RETRIES) {
      this.setState({
        calculatingSwap: false,
        errored: true,
        errorMsg: false,
      });
      console.error('Swap Failure: MAX RETRIES REACHED');
      return;
    }

    this.props.onSwapEstimateComplete(
      origFromAmount,
      this.props.toAmount,
      this.props.swapDistribution
    );

    if (!fromAmount || fromAmount.length === 0) {
      fromAmount = '0';
    } else {
      fromAmount = SwapFn.validateEthValue(this.props.from, fromAmount);
    }

    if (!timeNow) {
      timeNow = Date.now();
    }

    this.calculatingSwapTimestamp = timeNow;

    this.setState(
      {
        errored: false,
        errorMsg: false,
        calculatingSwap: true,
      },
      function (_timeNow, _attempt, _cb) {
        var fromAmountBN = window.ethers.utils.parseUnits(
          fromAmount,
          this.props.from.decimals
        );

        // add delay to slow down UI snappiness
        _.delay(
          function (_timeNow2, _attempt2, _cb2) {
            if (this.calculatingSwapTimestamp !== _timeNow2) {
              return;
            }
            this.fetchSingleChainSwapEstimate(
              origFromAmount,
              fromAmountBN,
              _timeNow2,
              _attempt2,
              _cb2
            );
          }.bind(this),
          500,
          _timeNow,
          _attempt,
          _cb
        );
      }.bind(this, timeNow, attempt, cb)
    );
  }

  fetchSingleChainSwapEstimate(
    origFromAmount,
    fromAmountBN,
    _timeNow2,
    _attempt2,
    _cb2
  ) {
    return SwapFn.getExpectedReturn(
      this.props.from,
      this.props.to,
      fromAmountBN
    )
      .then(
        function (_timeNow3, _cb3, result) {
          if (this.calculatingSwapTimestamp !== _timeNow3) {
            return;
          }

          const dist = _.map(result.distribution, e =>
            Number.isNaN(e) ? e.toNumber() : e
          );

          return Wallet.getBalance(this.props.from).then(bal => {
            return SwapFn.getApproveStatus(this.props.from, fromAmountBN).then(
              status => {
                console.log('Approval Status', status);
                this.props.onSwapEstimateComplete(
                  origFromAmount,
                  window.ethers.utils.formatUnits(
                    result.returnAmount,
                    this.props.to.decimals
                  ),
                  dist,
                  window.ethers.utils.formatUnits(
                    bal,
                    this.props.from.decimals
                  ),
                  status
                );

                this.setState(
                  {
                    calculatingSwap: false,
                  },
                  () => {
                    if (_cb3) {
                      _cb3();
                    }

                    Metrics.track('swap-estimate-result', {
                      from: this.props.from,
                      to: this.props.to,
                      fromAmont: fromAmountBN.toString(),
                      toAmount: this.props.toAmount,
                      swapDistribution: this.props.swapDistribution,
                    });
                  }
                );
              }
            );
          });
        }.bind(this, _timeNow2, _cb2)
      )
      .catch(
        function (_timeNow3, _attempt3, _cb3, e) {
          console.error('SWAP ESTIMATE FAILED: ', e);
          if (this.calculatingSwapTimestamp !== _timeNow3) {
            return;
          }

          // try again
          this.fetchSwapEstimate(
            origFromAmount,
            _timeNow3,
            _attempt3 + 1,
            _cb3
          );
        }.bind(this, _timeNow2, _attempt2, _cb2)
      );
  }

  handleTokenAmountChange(e) {
    if (!isNaN(+e.target.value)) {
      var targetAmount = e.target.value;

      // if input is in exponential format, convert to decimal.
      // we do this because all of our logic does not like the exponential format
      // when converting to BigNumber.
      // Otherwise we take the raw number as is, otherwise you get funky
      // input behaviour (i.e disappearing trailing zeros in decimals)
      if (targetAmount.toLowerCase().includes('e')) {
        targetAmount = SwapFn.validateEthValue(this.props.from, targetAmount);
      }

      if (!SwapFn.isValidParseValue(this.props.from, targetAmount)) {
        // do nothing for now.
        // we don't want to interrupt the INPUT experience,
        // as it moves the cursor around. we correct the value at the Submit step,
        // in the higher-order component SwapWidget.jsx
      }

      Metrics.track('swap-token-value', {
        value: targetAmount,
        from: this.props.from,
        to: this.props.to,
      });

      this.fetchSwapEstimate(targetAmount);
    }
  }



  handleSubmit(e) {
    if (!Wallet.isConnected()) {
      EventManager.emitEvent('promptWalletConnect', 1);
    } else if (
      !SwapFn.isValidParseValue(this.props.from, this.props.fromAmount)
    ) {
      var correctAmt = SwapFn.validateEthValue(
        this.props.from,
        this.props.fromAmount
      );
      this.fetchSwapEstimate(
        correctAmt,
        undefined,
        undefined,
        this.props.handleSubmit
      );
    } else if (this.validateOrderForm()) {
      EventManager.emitEvent('networkHoverableUpdated', { hoverable: false });
      this.props.handleSubmit();
    }
  }

  handleTokenSwap(e) {
    if (!this.state.calculatingSwap) {
      this.props.onSwapTokens(e);
    }
  }

  handleNetworkDropdownChange(isFrom) {
    return function (network) {
      if (network.enabled) {
        Sentry.addBreadcrumb({
          message: 'Action: Network Changed: ' + network.name,
        });

        this.props.handleCrossChainChange(isFrom, network);
      }
    }.bind(this);
  }

  handleMax() {
    if (Wallet.isConnected() && this.props.from.address) {
      Wallet.getBalance(this.props.from)
        .then(
          function (bal) {
            _.defer(
              function () {
                // balance is in WEI and is a BigNumber
                this.fetchSwapEstimate(
                  window.ethers.utils.formatUnits(bal, this.props.from.decimals)
                );
              }.bind(this)
            );
          }.bind(this)
        )
        .catch(
          function (e) {
            console.error('Failed to get balance for MAX', e);
            // try again
            this.handleMax();
          }.bind(this)
        );
    }
  }

  renderTokenInput(target, token) {
    // if (!token) {
    //   return <div />;
    // }

    var isFrom = target === 'from';

    return (
      <div className="level is-mobile">
        <div
          className="level is-mobile is-narrow my-0 token-dropdown"
          onClick={this.props.handleSearchToggle(target)}
        >
          <TokenIconBalanceGroupView
            network={isFrom ? this.props.fromChain : this.props.toChain}
            token={token}
            refresh={this.props.refresh}
          />
          <div className="level-item">
            <span className="icon-down">
              <ion-icon name="chevron-down"></ion-icon>
            </span>
          </div>
        </div>
        <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
          <div className="field" style={{ width: '100%', maxWidth: '250px' }}>
            <div
              className={classnames('control', {
                'is-loading': !isFrom && this.state.calculatingSwap,
              })}
              style={{ width: '100%' }}
            >
              <input
                onChange={this.handleTokenAmountChange}
                value={
                  !isFrom && this.state.errored
                    ? ''
                    : this.props[`${target}Amount`] || ''
                }
                type="number"
                min="0"
                lang="en"
                step="0.000000000000000001"
                className={classnames('input is-medium', {
                  //"is-danger": isFrom && !this.hasSufficientBalance(),
                  'is-to': !isFrom,
                  'is-from': isFrom,
                  'is-danger': !isFrom && this.state.errored,
                })}
                placeholder="0.0"
                disabled={!isFrom}
              />

              {isFrom && (
                <div className="max-btn" onClick={this.handleMax}>
                  Max
                </div>
              )}

              {isFrom && !this.hasSufficientBalance() && (
                <div className="warning-funds">Insufficient funds</div>
              )}

              {!isFrom && this.state.errored && (
                <div className="warning-funds">
                  {this.state.errorMsg || 'Estimate failed. Try again'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getCTAButtonMessage() {
    // this performs the check that the selected network matches the network by the
    // wallet provider
    if (Wallet.isConnected()) {
      return 'Review Order';
      // prompt the user to switch networks, if the network does not match
    } else if (Wallet.isConnectedToAnyNetwork()) {
      return 'Switch Network';
    } else {
      return 'Connect Wallet';
    }
  }

  render() {
    return (
      <div className="page page-view-order">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-right">
              <div className="level-item">
                <span
                  className="icon clickable settings-icon"
                  onClick={this.props.handleSettingsToggle}
                >
                  <ion-icon name="settings-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>

          <div className="notification is-white my-0">
            <div className="text-gray-stylized">
              <span>You Pay</span>
            </div>
            {this.renderTokenInput('from', this.props.from)}
          </div>

          <div className="swap-icon-wrapper">
            <div className="swap-icon-v2 icon" onClick={this.handleTokenSwap}>
              <ion-icon name="swap-vertical-outline"></ion-icon>
            </div>

            <div className="swap-icon is-hidden" onClick={this.handleTokenSwap}>
              <i className="fas fa-long-arrow-alt-up"></i>
              <i className="fas fa-long-arrow-alt-down"></i>
            </div>
          </div>

          <div className="notification is-white bottom">
            <div className="text-gray-stylized">
              <span>You Receive</span>
            </div>
            {this.renderTokenInput('to', this.props.to)}
          </div>

          <div
            className={classnames('hint--large', 'token-dist-expand-wrapper', {
              'hint--top': this.props.swapDistribution,
              expand: this.props.swapDistribution,
            })}
            aria-label="We have queried multiple exchanges to find the best possible pricing for this swap. The below routing chart shows which exchanges we used to achieve the best swap."
          >
            <div className="token-dist-hint-text">
              <span>Routing Distribution</span>
              <span className="hint-icon">?</span>
            </div>
            <TokenSwapDistribution parts={this.props.swapDistribution} />
          </div>

          <div>
            <button
              disabled={Wallet.isConnected() && !this.validateOrderForm()}
              className="button is-primary is-fullwidth is-medium"
              onClick={this.handleSubmit}
            >
              {this.getCTAButtonMessage()}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
