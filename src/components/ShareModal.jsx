import React, { useState } from 'react';

import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from '../components/Modal';
//Styling and Animationimport styled from "styled-components";
import styled from 'styled-components';

function ShareModal({ theme_, show, onClose, url }) {
  const [copied, setCopied] = useState(false);
  return (
    <Modal title="Share" show={show} onClose={onClose}>
      <SharedModalChildren isDarkMode={theme_}>
        <div className="share-icons">
          <FacebookShareButton url={url || window.location.href}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <TwitterShareButton url={url || window.location.href}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>

          <WhatsappShareButton url={url || window.location.href}>
            <WhatsappIcon size={32} round={true} />{' '}
          </WhatsappShareButton>
          <PinterestShareButton url={url || window.location.href}>
            <PinterestIcon size={32} round={true} />
          </PinterestShareButton>
          <LinkedinShareButton url={url || window.location.href}>
            <LinkedinIcon size={32} round={true} />{' '}
          </LinkedinShareButton>
          <RedditShareButton url={url || window.location.href}>
            <RedditIcon size={32} round={true} />{' '}
          </RedditShareButton>
          <TelegramShareButton url={url || window.location.href}>
            <TelegramIcon size={32} round={true} />{' '}
          </TelegramShareButton>
        </div>
        <div className="share-link">
          <span className="share-left">
            {url || window.location.href.length > 25
              ? url || window.location.href.substring(0, 25) + '...'
              : url || window.location.href}
          </span>
          <CopyToClipboard
            text={url || window.location.href}
            onCopy={() => setCopied(true)}
          >
            <span className="click right">{copied ? 'Copied' : 'Copy'}</span>
          </CopyToClipboard>
        </div>
      </SharedModalChildren>
    </Modal>
  );
}

export default ShareModal;

const SharedModalChildren = styled.div`
  color: ${({ isDarkMode }) => (isDarkMode ? 'white' : 'black')};
  width: 100%;
  .share-icons {
    display: flex;
    justify-content: space-around;
    padding: 1rem 2rem;
    @media screen and (max-width: 900px) {
      padding: 1rem 1rem;
    }
  }
  .share-link {
    display: flex;
    justify-content: center;
    padding: 1rem 2rem;
    width: 100%;
    span {
      border-bottom: 2px solid #50c1e9;
      padding: 1rem 1.4rem;
      max-width: 80%;
      overflow-x: hidden;
      @media screen and (max-width: 900px) {
        padding: 0.3rem 0.2rem;
      }
    }
    @media screen and (max-width: 900px) {
      padding: 0.5rem 1rem;
    }
    .click {
      max-width: 20%;
      color: #50c1e9;
      cursor: pointer;
      padding-left: 0.8rem;
    }
  }
`;
