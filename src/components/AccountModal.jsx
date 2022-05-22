import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';
import Modal from './Modal';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import transak from '../assets/images/transak.png';
const AccountModal = ({ show, onClose, disconnect, account, user }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, changeTheme } = useContext(AppContext);
  const close = () => {
    disconnect();
    onClose();
  };
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Account"
      modalStyle={{ height: 'auto' }}
    >
      <StyledAccountModal theme_={theme}>
        <span className="row">
          <p>Username:</p>
          <p>{user?.name || 'Comrade'}</p>
        </span>

        <span className="row">
          <p> Change Theme:</p>
          {theme ? (
            <button onClick={() => changeTheme()} className="theme-btn ">
              <DarkModeIcon />
            </button>
          ) : (
            <button onClick={() => changeTheme()} className="theme-btn ">
              <Brightness7Icon />
            </button>
          )}
        </span>
        <span>
          Connected Address: {account?.slice(0, 4)}...{account?.slice(-4)}
        </span>
        <button
          className="plain-btn transak"
          onClick={() =>
            window.open(
              'https://staging-global.transak.com/?apiKey=7f968f9d2-b587-4325-9b6a-ad482a6e2f6c',
              '_blank'
            )
          }
        >
          <img src={transak} /> <p>Buy Crypto Using Transak</p>
        </button>
        <button onClick={close}>Disconnect</button>

        <Link to={`/profile/${account}`}>Redirect to Profile</Link>
      </StyledAccountModal>
    </Modal>
  );
};
const StyledAccountModal = styled.div`
  padding: 2rem 0rem;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  .transak {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    img {
      width: 2rem;
      height: 2rem;
    }
  }
  .row {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  span {
    font-size: 1.2rem;
  }
`;
export default AccountModal;
