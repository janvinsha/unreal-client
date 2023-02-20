import { useState, useEffect, useContext } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import ScrollContainer from 'react-indiana-drag-scroll';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { NftCard, Sponsor } from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/HM.png';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
export default function CollectionDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const collectionId = pathname.split('/')[2];
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(AppContext);

  const tabs = ['Items'];
  const [activeTab, setActiveTab] = useState('Items');

  const GET_COLLECTION_QUERY = gql`
    query GetCollectionNfts($id: String) {
      collections(first: 1, where: { collectionId_contains: $id }) {
        id
        name
        description
        owner
      }
    }
  `;

  const { data: resultData } = useQuery(GET_COLLECTION_QUERY, {
    variables: { id: collectionId },
  });

  let foundCollection = resultData;

  const GET_NFT_QUERY = gql`
    query GetNfts($id: String) {
      marketItems(first: 10, where: { collection_contains: $id, sold: false }) {
        id
        tokenId
        price
        name
        image
      }
    }
  `;

  const { data: nftsData } = useQuery(GET_NFT_QUERY, {
    //TODO: change the id to collectionsID
    variables: { id: collectionId },
  });

  let nfts = nftsData?.marketItems;
  console.log('THIS ARE THE NFTS', nfts);
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

  const { data: getProfileData } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      id:
        foundCollection?.owner || `0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39`,
    },
  });
  let userProfile = getProfileData?.profiles[0];
  return (
    <StyledCollectionDetails
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <div className="collection">
        <div className="header">
          <span
            onClick={() => navigate(`${location?.state?.path || '/'}`)}
            className="back"
          >
            <KeyboardBackspaceIcon />
          </span>
          <span>
            <h3>Collection</h3>
          </span>
        </div>
        <div className="photo-cont">
          <img src={defPic} className="cover" alt="img" />
          <span className="dp">
            <img src={defPic} className="cover" alt="img" />
          </span>
        </div>

        <div className="details">
          <span className="bio">
            <p>{foundCollection?.name}</p>
            <p>{foundCollection?.description}</p>
            <span>
              Owned By:
              <Link to={`/profile/${userProfile?.id}`}>
                {userProfile?.name || 'Comrade'}
              </Link>
            </span>
          </span>
        </div>
        <span className="tabs">
          {tabs?.map((tab, index) => (
            <span
              className={`tab ${activeTab === tab && 'active'}`}
              key="index"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <div className="line"></div>
            </span>
          ))}
        </span>

        <div className="nfts">
          {nfts?.map((nft, x) => (
            <NftCard nft={nft} key={x} />
          ))}
        </div>
      </div>
    </StyledCollectionDetails>
  );
}
const StyledCollectionDetails = styled(motion.div)`
  min-height: 81vh;
  display: flex;
  flex-flow: column wrap;

  padding: 0rem 6rem;
  gap: 2.5rem;
  @media screen and (max-width: 900px) {
    padding: 0rem 0rem;
  }

  .collection {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    h3 {
      font-size: 1.3rem;
      font-weight: 500;
    }

    h3 {
      font-size: 1.3rem;
      font-weight: 500;
    }
    .body {
    }
    @media screen and (max-width: 900px) {
      width: 100%;
    }
    .header {
      display: flex;
      gap: 1rem;
      align-items: center;
      position: sticky;
      top: 0;
      padding: 1rem 2rem;

      .back {
        cursor: pointer;
      }
      z-index: 2;
      @media screen and (max-width: 900px) {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0.8rem 1rem;
      }
    }
    .photo-cont {
      height: 13rem;
      position: relative;
      margin-bottom: 4.5rem;
      .cover {
        display: block;
        object-fit: cover;
        height: 100%;
        width: 100%;
      }

      .dp {
        position: absolute;
        bottom: -28%;
        left: 50%;
        transform: translateX(-50%);
        width: 8.5rem;
        height: 8.5rem;
        border-radius: 50%;
        border: 5px solid ${({ theme_ }) => (theme_ ? '#0f0f0f' : '#ffffff')};
        overflow: hidden;
        display: flex;

        cursor: pointer;
        background: ${({ theme_ }) =>
          theme_ ? 'rgb(15, 15, 15,1)' : 'rgb(255, 255, 255,1)'};
        img {
          width: 100%;
          object-fit: cover;
          display: block;
        }
        .edit {
          display: none;
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
        }
        &:hover {
          img {
            opacity: 0.8;
          }

          .edit {
            display: block;
          }
        }
      }
    }

    img {
      display: block;
      width: 100%;
    }
    .details {
      display: flex;
      flex-flow: column wrap;
      gap: 0.7rem;
      align-items: center;
      padding-bottom: 2rem;
      align-items: center;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      h2 {
        font-size: 1.3rem;
        font-weight: 500;
      }
      .with-icon {
        display: flex;
        align-items: center;
        gap: 0.1rem;
      }
      .bio {
        padding: 0rem 2rem;
        display: flex;
        flex-flow: column wrap;
        gap: 0.2rem;
        align-items: center;
        font-size: 1.2rem;
        @media screen and (max-width: 900px) {
          width: 100%;
        }
      }
      .follow-stats {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }
    }
  }

  .tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    width: 100%;
    .tab {
      padding: 0rem 2rem;
      padding-top: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;
      &:hover {
        color: gray;
      }
      .line {
        margin-top: 0.5rem;
        padding: 2px;
        background: inherit;
        border-radius: 3rem 3rem 0px 0px;
      }
      &.active {
        .line {
          background: #d04bff;
        }
      }
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
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 0.5rem;
      width: 100%;
      padding: 0rem 0rem;
      padding: 1rem;
    }
  }
`;
