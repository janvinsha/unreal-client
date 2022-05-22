import { useState, useEffect, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { NftCard, Sponsor } from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/HM.png';

import { sponsors } from '../data';
import useInView from 'react-cool-inview';

const POPULAR_NFTS_QUERY = gql`
  query GetPopularNfts {
    marketItems(first: 8) {
      id
      tokenId
      seller
      owner
      price
      sold
      collectionId
      name
      image
      category
      description
      tags
    }
  }
`;
const TOP_NFT_QUERY = gql`
  query GetTopNft {
    marketItem(id: "1") {
      id
      tokenId
      seller
      owner
      price
      sold
      collectionId
      name
      image
      category
      description
      tags
    }
  }
`;
export default function Home() {
  const navigate = useNavigate();

  const { theme } = useContext(AppContext);

  const nfts = [{}, {}, {}, {}, {}, {}, {}, {}];
  const { data, loading, error } = useQuery(POPULAR_NFTS_QUERY);

  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = useQuery(TOP_NFT_QUERY);

  console.log(data, popularData);
  const GET_PROFILE_QUERY = gql`
    query GetProfile($id: String) {
      profiles(first: 1, where: { profileId_contains: $id }) {
        id
        profileId
        banner
        dp
      }
    }
  `;

  const { data: getProfileData } = useQuery(GET_PROFILE_QUERY, {
    variables: { id: `0xFF3e7fD8994d7dbEcdCfFA54EDcAaf6A8DB2CbF8` },
  });
  let userProfile = getProfileData?.profiles[0];
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
          <img src={defPic} alt="img" />
        </div>
        <div className="about">
          <h1>HackMoney (2022)</h1>
          <span className="author">
            <img src={userProfile?.dp || defPic} alt="img" />{' '}
            <Link to={`/profile/${userProfile?.id}`}>
              {userProfile?.name || 'Comrade'}
            </Link>
          </span>
          <span className="price">
            <span>Collection</span> <Link to="/collections/2">Ethglobal</Link>
          </span>

          <p>Build the future of Finance</p>
          <div className="price">
            <span>Price</span>
            <h2>1 ETH</h2>
          </div>
          <button onClick={() => navigate('/nfts/3')}>Buy Nft</button>
        </div>
      </div>
      {/* <div className="popular-nfts">
        <div className="title">
          <span className="sub-title">
            <h4>Popular Nfts</h4> <Link to="/explore">View all Nfts</Link>
          </span>
          <div className="divider"></div>
        </div>

        <div className="nfts">
          {nfts.map(nft => (
            <NftCard nft={nft} />
          ))}
        </div>
      </div> */}

      <div className="about">
        <h1>Project</h1>
        <span className="about-desc">
          <h3>
            This project was built for the HackMoney 2022 Hackathon by ETHGlobal
          </h3>
          <h2>Notable Sponsors used</h2>
        </span>

        <div className="sponsors">
          {sponsors.map(sponsor => (
            <Sponsor sponsor={sponsor} />
          ))}
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
    .img {
      width: 26rem;
      height: 26rem;
      overflow: hidden;
      border-radius: 1rem;
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
        grid-template-columns: repeat(2, 1fr);
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
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 0.5rem;
      width: 100%;
      padding: 0rem 0rem;
    }
  }
`;
