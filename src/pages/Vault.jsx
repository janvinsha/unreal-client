import { useState, useEffect, useContext } from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { NftCard, Sponsor } from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/bg.jpg';

export default function Vault() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(AppContext);

  return (
    <StyledVault
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    ></StyledVault>
  );
}
const StyledVault = styled(motion.div)`
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
      width: 22rem;
      height: 22rem;
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
      gap: 1.5rem;

      button {
        padding: 0.5rem 5rem;
      }
      .author {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        img {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.2rem;
          object-fit: cover;
        }
      }
      .price {
        display: flex;
        gap: 3rem;
        .left {
          display: flex;
          flex-flow: column wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .right {
          gap: 0.5rem;
          display: flex;
          flex-flow: column wrap;
          align-items: center;
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
