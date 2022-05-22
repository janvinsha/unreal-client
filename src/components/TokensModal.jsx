import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';
import Modal from './Modal';

const TokensModal = ({ show, onClose, title }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, changeTheme } = useContext(AppContext);
  const close = () => {
    onClose();
  };
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      modalStyle={{ height: 'auto' }}
    >
      <StyledTokensModal theme_={theme}></StyledTokensModal>
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
