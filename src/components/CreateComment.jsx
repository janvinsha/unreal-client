import React, { useContext, useState, useEffect } from 'react';

import styled from 'styled-components';
import { NFTStorage, File } from 'nft.storage/dist/bundle.esm.min.js';

import AppContext from '../context/AppContext';

import CloseIcon from '@mui/icons-material/Close';

import { create } from 'ipfs-http-client';

import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

import { Loader } from './index';

/* Create an instance of the client */

const CreateComment = ({ post, text, setText, sendMessageOnClick }) => {
  const { theme, accountDetails } = useContext(AppContext);

  const [image, setImage] = useState();
  const [video, setVideo] = useState();
  const submitHandler = () => {};
  return (
    <StyledCreateComment theme_={theme}>
      <Loader visible={false} />
      <div className="container">
        <textarea
          type="text"
          onChange={e => setText(e.target.value)}
          value={text}
          placeholder="Say Something about this NFT?"
          className="input-text"
        ></textarea>

        <div className="footer">
          <span className="submit" onClick={submitHandler}>
            <button className="upload" onClick={sendMessageOnClick}>
              <SendIcon />
            </button>
          </span>
        </div>
      </div>
    </StyledCreateComment>
  );
};
const StyledCreateComment = styled.div`
  padding: 0rem 2rem;

  border-radius: 0.5rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  font-size: 1.2rem;
  overflow: hidden;
  padding: 0.35rem 1rem;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
  width: 50%;
  @media screen and (max-width: 900px) {
    width: 100%;
    padding: 0rem 1rem;
  }

  .container {
    display: flex;

    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5rem;
    padding: 0.5rem;
    .input-text {
      background: inherit;
      border: none;
      font-size: 1.2rem;
      outline: none;

      resize: none;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      height: auto;
    }

    .footer {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      padding: 0rem 0rem;
      button {
        font-size: 1.5rem;
        padding: 0rem 0rem;
      }
      .upload {
        padding: 0.2rem 1rem;
      }
    }
  }
`;
export default CreateComment;
