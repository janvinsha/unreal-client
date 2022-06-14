import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';
import Modal from './Modal';
import { Image } from '@chakra-ui/react';
const ChainsModal = ({
  show,
  onClose,
  title,
  handleChainChange,
  target,
  chainList,
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, changeTheme } = useContext(AppContext);

  console.log(chainList, 'HERE IS THE chain LIST');
  const handleSelect = chainId => {
    handleChainChange(chainId);
    onClose();
  };
  useEffect(() => {}, []);

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      modalStyle={{ height: 'auto' }}
    >
      <StyledChainsModal theme_={theme}>
        {chainList?.map((v, i) => (
          <span className="chain" onClick={() => handleSelect(v.chainId)}>
            <Image
              src={v.logo || 'https://etherscan.io/images/main/empty-token.png'}
              alt=""
              width="30px"
            />{' '}
            <h3>{v.slug}</h3>
          </span>
        ))}
      </StyledChainsModal>
    </Modal>
  );
};
const StyledChainsModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 30rem;
  overflow-y: scroll;
  .chain {
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 1rem;
    background: ${({ theme_ }) => (theme_ ? '#16161A' : '#ffffff')};
    background: blue;
    background: ${({ theme_ }) => (theme_ ? '#24242b' : '#ffffff')};
    padding: 1rem;
    cursor: pointer;
  }
`;
export default ChainsModal;
