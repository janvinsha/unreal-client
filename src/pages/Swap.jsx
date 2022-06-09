import { useState, useEffect, useMemo, useContext } from 'react';
// import { useMoralis } from "react-moralis";
// import InchModal from "./components/InchModal";
// import useInchDex from "hooks/useInchDex";

import {
  Input,
  Input as InputNumber,
  Image,
  Modal,
  Text,
} from '@chakra-ui/react';
import _ from 'underscore';
import { TokensModal } from '../components';

// import { useTokenPrice } from 'react-moralis';
// import { tokenValue } from 'helpers/formatters';
// import { getWrappedNative } from 'helpers/networks';
// import { useOneInchQuote } from "react-moralis";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AppContext from '../context/AppContext';

// import TokenListManager from '../utils/tokenList';
// import SwapFn from '../utils/swapFn';
// import GlobalStateManager from '../utils/global';
// import { approvalState } from '../constants';
// import Metrics from '../utils/metrics';
// import EventManager from '../utils/events';

function DEX() {
  // const { trySwap, tokenList, getQuote } = useInchDex(chain);

  // // const { Moralis, isInitialized, chainId } = useMoralis();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();
  const [approveStatus, setApproveStatus] = useState();
  const [swapDistribution, setSwapDistribution] = useState();
  // const swapConfig = GlobalStateManager.getSwapConfig();

  const { theme, accountDetails } = useContext(AppContext);
  const handleTokenListToggle = target => {
    if (target == 'from') {
      setFromModalActive(true);
    } else {
      setToModalActive(true);
    }
  };

  // const network = TokenListManager.getCurrentNetworkConfig();
  // const crossChainTokens = _.map(network?.supportedCrossChainTokens, v =>
  //   TokenListManager.findTokenById(v, network)
  // );
  // const tokenList = false // TODO always show reduced list; && this.props.isFrom
  //   ? crossChainTokens
  //   : undefined;

  // const handleTokenChange = (token, target) => {
  //   if (target === 'from') {
  //     setFromAmount(SwapFn.validateEthValue(token, fromAmount));
  //   }
  // };

  // const defaultTo = TokenListManager.findTokenById(network?.defaultPair?.to);
  // const defaultFrom = TokenListManager.findTokenById(
  //   network?.defaultPair?.from
  // );
  // GlobalStateManager.updateSwapConfig({
  //   to: defaultTo,
  //   from: defaultFrom,
  //   toChain: network?.name,
  //   fromChain: network?.name,
  // });

  // function handleTransactionComplete(success, hash) {
  //   EventManager.emitEvent('networkHoverableUpdated', { hoverable: true });
  // }

  // function handleConfirm() {
  //   const fromAmountBN = window.ethers.utils.parseUnits(fromAmount);

  //   if (approveStatus === approvalState.APPROVED) {
  //     const distBN = _.map(swapDistribution, e =>
  //       window.ethers.utils.parseUnits(`${e}`, 'wei')
  //     );
  //     SwapFn.performSwap(defaultFrom, defaultTo, fromAmountBN, distBN)
  //       .then(nonce => {
  //         console.log(nonce);

  //         handleTransactionComplete(true, nonce);

  //         Metrics.track('swap-complete', {
  //           from: defaultFrom,
  //           to: defaultTo,
  //           fromAmount,
  //         });
  //       })
  //       .catch(e => {
  //         console.error('#### swap failed from catch ####', e);

  //         handleTransactionComplete(false, undefined);
  //       });
  //   } else {
  //     SwapFn.performApprove(defaultFrom, fromAmountBN)
  //       .then(confirmedTransaction => {
  //         Metrics.track('approve-complete', {
  //           from: defaultFrom,
  //           fromAmount: fromAmount,
  //         });
  //         onApproveComplete(approvalState.APPROVED);
  //       })
  //       .catch(e => {
  //         console.error('#### approve failed from catch ####', e);
  //         console.error(e);
  //       });
  //   }
  // }

  // function onApproveComplete(approveStatus) {}
  // function onSwapEstimateComplete(
  //   ofromAmount,
  //   otoAmount,
  //   dist,
  //   oavailBalBN,
  //   oapproveStatus
  // ) {
  //   if (ofromAmount === fromAmount && otoAmount === toAmount) {
  //     return;
  //   }
  //   setFromAmount(ofromAmount);
  //   setToAmount(otoAmount);
  //   setSwapDistribution(dist);

  //   setApproveStatus(oapproveStatus);
  // }
  return (
    <>
      <StyledDex theme_={theme}>
        <h2>Cross Chain Swap(Swing) In development</h2>
        <div className="dex">
          <motion.div className="row">
            <h3>From</h3>
            <div className="input-row">
              <div className="row-input-div">
                <InputNumber
                  type="number"
                  placeholder="0.00"
                  className="row-input"
                  onChange={e => setFromAmount(e.target.value)}
                  value={fromAmount}
                  focusBorderColor="#0b172e"
                />
                {/* <h3>{fromTokenAmountUsd}</h3> */}
              </div>
              <button
                className="token-btn"
                onClick={() => handleTokenListToggle('from')}
              >
                {/* {fromToken ? ( */}
                {true ? (
                  <Image
                    src={
                      // fromToken?.logoURI ||
                      'https://etherscan.io/images/main/empty-token.png'
                    }
                    alt="nologo"
                    width="30px"
                    preview={false}
                    style={{ borderRadius: '15px' }}
                  />
                ) : (
                  <span>Select a token</span>
                )}
                {/* <span>{fromToken?.symbol}</span> */}
                <Arrow />
              </button>
            </div>
          </motion.div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px',
            }}
          >
            <ArrowDownwardIcon />
          </div>
          <motion.div className="row">
            <h3>To</h3>
            <div className="input-row">
              <div className="row-input-div">
                <Input
                  className="row-input down"
                  placeholder="0.00"
                  readOnly
                  // value={
                  //   quote
                  //     ? parseFloat(
                  //         Moralis?.Units?.FromWei(
                  //           quote?.toTokenAmount,
                  //           quote?.toToken?.decimals
                  //         )
                  //       ).toFixed(6)
                  //     : ''
                  // }
                />
                {/* <h3>{toTokenAmountUsd}</h3> */}
              </div>
              <button
                className="token-btn"
                onClick={() => handleTokenListToggle('to')}
                // type={toToken ? 'default' : 'primary'}
              >
                {/* {toToken ? ( */}
                {false ? (
                  <Image
                    src={
                      // toToken?.logoURI ||
                      'https://etherscan.io/images/main/empty-token.png'
                    }
                    alt="nologo"
                    width="30px"
                    preview={false}
                    style={{ borderRadius: '15px' }}
                  />
                ) : (
                  <span>Select a token</span>
                )}
                {/* <span>{toToken?.symbol}</span> */}
                <Arrow />
              </button>
            </div>
          </motion.div>
          {/* {quote && (
            <div>
              <span className="gas-texts">
                <h3>Estimated Gas:</h3> <h3>{quote?.estimatedGas}</h3>
              </span>
              <PriceSwap />
            </div>
          )} */}
          <button
            type="primary"
            size="large"
            className="swap-btn"
            // onClick={() => trySwap(currentTrade)}
            // disabled={!ButtonState.isActive}
          >
            {/* {ButtonState.text} */}
            Swap
          </button>
        </div>
      </StyledDex>
      {/* 
      <TokensModal
        title="Select a token"
        show={isFromModalActive}
        onClose={() => setFromModalActive(false)}
        setFromToken={setFromToken}
        tokenList={tokenList}
        handleTokenChange={handleTokenChange}
        target="from"
      />
      <TokensModal
        title="Select a token"
        setToken={setToToken}
        onClose={() => setToModalActive(false)}
        show={isToModalActive}
        tokenList={tokenList}
        handleTokenChange={handleTokenChange}
        target="to"
      /> */}
    </>
  );
}

const StyledDex = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0rem;
  h3 {
  }
  .dex {
    width: 28rem;
    padding: 1.5rem 1rem 1rem 1rem;
    border-radius: 0.5rem;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-flow: column wrap;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
    gap: 0.5rem;
    @media (max-width: 900px) {
      width: 100%;
    }
    .row {
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      .token-btn {
        display: flex;
        align-items: center;
        gap: 0.1rem;
        outline: none;
      }
      .input-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        -moz-box-shadow: 0 0 3px #ccc;
        -webkit-box-shadow: 0 0 3px #ccc;
        box-shadow: 0 0 3px #ccc;
        border-radius: 0.5rem;
        padding: 1rem;
        .row-input-div {
          padding: 0.5rem;
          .row-input {
            display: flex;
            background: none;

            border: none;
            outline: none;
          }
        }
      }
    }
    .gas-texts {
      display: flex;
      gap: 1rem;
    }
    .swap-btn {
      margin-top: 0.5rem;

      padding: 0.6rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.2rem;
      /* &:disabled {
        background-color: red;
      } */
    }
  }
`;

export default DEX;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
