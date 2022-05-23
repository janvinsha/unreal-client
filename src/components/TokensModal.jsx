import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';
import Modal from './Modal';
import EventManager from '../utils/events';
import Wallet from '../utils/wallet';
import TokenIconImg from './TokenIconImg';
import TokenListManager from '../utils/tokenList';
import _ from 'underscore';

const TokensModal = ({
  show,
  onClose,
  title,
  handleTokenChange,
  target,
  tokenList,
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, changeTheme } = useContext(AppContext);
  const [topTokens, setTopTokens] = useState();
  const handleSelect = token => {
    handleTokenChange(token, target);
    onClose();
  };
  useEffect(() => {
    onClose();
    updateTopTokens();
  }, []);

  function updateTopTokens() {
    let tokens;

    let network = TokenListManager.getCurrentNetworkConfig();

    tokens = _.map(network?.topTokens, function (v) {
      return TokenListManager.findTokenById(v, network);
    });
    tokens = _.compact(tokens);
    setTopTokens(tokens);

    return topTokens;
  }
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      modalStyle={{ height: 'auto' }}
    >
      <StyledTokensModal theme_={theme}>
        {topTokens?.map((v, i) => (
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg token={v} />
            </span>
            <div className="token-symbol-balance-wrapper">
              <span className="has-text-grey">{v.symbol}</span>
              <span className="has-text-grey">{this.getBalanceNumber(v)}</span>
            </div>
          </span>
        ))}
      </StyledTokensModal>
    </Modal>
  );
};
const StyledTokensModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
`;
export default TokensModal;
