import { useState, useEffect, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { NftCard, Sponsor } from '../components';
import AppContext from '../context/AppContext';
import { ethers } from 'ethers';
import { pageAnimation } from '../animation';

import defPic from '../assets/images/HM.png';
import sanitizeIpfsUrl from '../utils/sanitizeIpfsUrl';

const TOP_NFT_QUERY = gql`
  query GetTopNft {
    marketItem(id: "1") {
      id
      tokenId
      owner
      price
      name
      image
      description
    }
  }
`;
export default function Home() {
  const navigate = useNavigate();

  const { theme } = useContext(AppContext);

  const { data, loading, error } = useQuery(TOP_NFT_QUERY);

  const GET_PROFILE_QUERY = gql`
    query GetProfile($id: String) {
      profiles(first: 1, where: { profileId_contains: $id }) {
        id
        profileId
        banner
        dp
        name
      }
    }
  `;
  const nft = data?.marketItem;
  const { data: getProfileData } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      id: `${nft?.owner || '0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39'}`,
    },
  });
  let userProfile = getProfileData?.profiles[0];
  console.log('TOP NFT QUERY', data);

  return (
    <StyledHome
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <div className="desc">
        <h1> Discover, collect, and sell extraordinary NFTs</h1>
        <h2>on the fastest growing NFT marketplace</h2>
        <button className="plain-btn" onClick={() => navigate('/explore')}>
          Explore
        </button>
      </div>
      <div className="nft-desc">
        <div className="img">
          <img src={sanitizeIpfsUrl(nft?.image)} alt="img" />
        </div>
        <div className="about">
          <h1>{nft?.name}</h1>
          <span className="author">
            <img src={userProfile?.dp || defPic} alt="img" />{' '}
            <Link to={`/profile/${userProfile?.id}`}>
              {userProfile?.name || 'Comrade'}
            </Link>
          </span>
          <span className="price">
            <span>Collection</span> <Link to="/collections/2">Encode</Link>
          </span>

          <p>Build the future of Finance</p>
          <div className="price">
            <span>Price</span>
            <h2>
              {ethers.utils.formatUnits(nft?.price.toString() || 11, 'ether')}{' '}
              ETH
            </h2>
          </div>
          <button onClick={() => navigate('/nfts/1')}>Buy Nft</button>
        </div>
      </div>
    </StyledHome>
  );
}
const StyledHome = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;

  width: 100%;

  padding: 2rem 6rem;
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
  }
  .nft-desc {
    display: flex;
    gap: 6rem;
    padding: 1rem 10rem;
    justify-content: center;
    padding-bottom: 6rem;
    @media screen and (max-width: 900px) {
      width: 100%;
      padding: 1rem 0rem;
      align-items: center;
      flex-direction: column;
    }
    .img {
      width: 26rem;
      height: 26rem;
      overflow: hidden;
      border-radius: 1rem;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .about {
      width: 23rem;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-align: center;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      button {
        padding: 0.5rem 5rem;
      }
      .author {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-align: center;
        img {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.2rem;
          object-fit: cover;
        }
      }

      .price {
        display: flex;
        flex-flow: column wrap;
        padding: 0rem 0rem;
        gap: 0.3rem;
        text-align: center;
        span {
          font-size: 1.4rem;
        }
        h2 {
          color: #d04bff;
          font-size: 1.2rem;
        }
        a {
          font-size: 1.2rem;
          color: #d04bff;
        }
      }
    }
  }
  .popular-nfts {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    .title {
      display: flex;
      flex-flow: column wrap;
      .sub-title {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0rem;
      }
      .divider {
        background: #ccc;
        background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
        padding: 1px;
        width: 100%;
      }
    }

    .nfts {
      width: 100%;
      padding: 2rem 0rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 1rem;
      grid-row-gap: 1rem;
      @media screen and (max-width: 900px) {
        grid-template-columns: repeat(1 1fr);
        grid-column-gap: 0.5rem;
        grid-row-gap: 0.5rem;
        width: 100%;
        padding: 0rem 0rem;
      }
    }
  }
  .about {
    width: 100%;

    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
    align-items: center;
    .about-desc {
      text-align: center;
    }
  }
  .sponsors {
    width: 100%;
    padding: 2rem 0rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    @media screen and (max-width: 900px) {
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 1rem;
      width: 100%;
      padding: 0rem 0rem;
    }
  }
`;
