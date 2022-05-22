import { useState, useEffect, useContext } from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import Filter from '../components/Filter';
import { NftCard, Sponsor, CollectionCard } from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/bg.jpg';

export default function Explore() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState('nfts');
  const [sortBy, setSortBy] = useState('');
  const { theme } = useContext(AppContext);
  const nfts = [{}];

  const collections = [{}];

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

  const POPULAR_COLLECTIONS_QUERY = gql`
    query GetPopularCollections {
      collections(first: 8) {
        id
        collectionId
        banner
        dp
        owner
        name
        totalSupply
        noHolders
        description
        tags
      }
    }
  `;

  return (
    <StyledExplore
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <div className="main">
        <div className="header">
          <div className="left">
            <h3>Explore NFTs and Collections</h3>
          </div>
          <div className="right">
            <Filter
              name="Category"
              label=""
              asterik={false}
              defaultValue="art"
              className="filt"
              options={[
                { label: 'All NFTs', value: 'nfts' },
                { label: 'Collections', value: 'collections' },
              ]}
              onChange={e => setSelection(e.target.value)}
              theme={theme}
              required
            />
            <Filter
              name="Category"
              label=""
              asterik={false}
              defaultValue="art"
              className="filt"
              options={[
                { label: 'Popular', value: 'popular' },
                { label: 'Latest', value: 'latest' },
              ]}
              onChange={e => setSortBy(e.target.value)}
              theme={theme}
              required
            />
          </div>
        </div>

        <div className="cards">
          {selection === 'nfts'
            ? nfts.map(nft => <NftCard nft={nft} />)
            : collections.map(collection => (
                <CollectionCard collection={collection} />
              ))}
        </div>
      </div>
    </StyledExplore>
  );
}
const StyledExplore = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;

  width: 100%;

  padding: 2rem 4rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .left {
      @media screen and (max-width: 900px) {
        display: none;
      }
    }
    .right {
      display: flex;
      gap: 2rem;
      .filt {
        width: 8rem;
      }
    }
  }
  .cards {
    width: 100%;
    padding: 2rem 0rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    @media screen and (max-width: 900px) {
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 0.5rem;
      width: 100%;
      padding: 0rem 0rem;
    }
  }
`;
