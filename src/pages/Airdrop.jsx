import { useState, useEffect, useContext } from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { NftCard, Sponsor, WorldIDComponent } from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/bg.jpg';

export default function Airdrop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    theme,
    claim,
    currentAccount,
    connectWallet,
    worldIDProof,
    setWorldIDProof,
  } = useContext(AppContext);

  return (
    <StyledAirdrop
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <div className="desc">
        <h1>Recieve Airdrop</h1>
        <h2>
          This Airdrop is only available once you've created a collection and
          can only be redeemed once, login to redeem
        </h2>
        {currentAccount ? (
          <div className="claim">
            <WorldIDComponent
              signal={currentAccount}
              className="plain-btn"
              setProof={proof => setWorldIDProof(proof)}
            />
            <button disabled={!worldIDProof} onClick={claim}>
              Recieve Airdrop
            </button>
          </div>
        ) : (
          <button className="plain-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </StyledAirdrop>
  );
}
const StyledAirdrop = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;

  width: 100%;

  padding: 9rem 10rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
  }
  .desc {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0rem;

    h2 {
      font-weight: medium;
    }
    button {
      margin-top: 1rem;
    }
    .claim {
      padding: 1rem 0rem;
      button {
        &:disabled {
          opacity: 0.6;
          cursor: none;
        }
      }
    }
  }
`;
