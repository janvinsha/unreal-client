import { useState, useEffect, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  Post,
  RecommendedUsers,
  EditProfileModal,
  PageLoader,
  FollowModal,
  HomeSearch,
} from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EditIcon from '@mui/icons-material/Edit';

import { NftCard, Sponsor, CollectionCard } from '../components';
import defPic from '../assets/images/bg.png';

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const handle = pathname.split('/')[2];

  const [profileModal, setProfileModal] = useState(false);

  const [activeTab, setActiveTab] = useState('Items');
  const { currentAccount, theme, userProfile } = useContext(AppContext);
  let tabs = ['Items', 'Collections'];

  let userDetails = {};
  const nfts = [{}];

  const collections = [{}];

  const GET_PROFILE_QUERY = gql`
    query GetProfile($id: String) {
      profiles(first: 1, where: { profileId_contains: $id }) {
        id
        profileId
        banner
        dp
        name
        bio
      }
    }
  `;

  const { data: getProfileData } = useQuery(GET_PROFILE_QUERY, {
    variables: { id: `${handle}` },
  });
  console.log('THIS IS THE PROFILE DATA', getProfileData?.profiles[0]);
  let foundUser = getProfileData?.profiles[0];
  return (
    <StyledProfile
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      {!userDetails ? (
        <PageLoader visible={true} />
      ) : (
        <>
          <div className="profile">
            <div className="header">
              <span
                onClick={() => navigate(`${location?.state?.path || '/'}`)}
                className="back"
              >
                <KeyboardBackspaceIcon />
              </span>
              <span>
                <h3>Profile</h3>
              </span>
            </div>
            <div className="photo-cont">
              <img
                src={foundUser?.banner || defPic}
                className="cover"
                alt="img"
              />
              <span className="dp">
                <img
                  src={foundUser?.dp || defPic}
                  className="cover"
                  alt="img"
                />
              </span>
            </div>

            <div className="details">
              {currentAccount == handle && (
                <button onClick={() => setProfileModal(true)}>
                  Edit Profile
                </button>
              )}
              {currentAccount == handle && (
                <button
                  className="plain-btn"
                  onClick={() => navigate('/create-collection')}
                >
                  Create Collection
                </button>
              )}
              <span className="bio">
                <p>{foundUser?.id}</p>
                <p>{foundUser?.name}</p>
                <p>{foundUser?.bio}</p>
              </span>
            </div>

            <span className="tabs">
              {tabs.map((tab, index) => (
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
          </div>
          <div className="cards">
            {activeTab === 'Items'
              ? nfts.map(nft => <NftCard nft={nft} />)
              : collections.map(collection => (
                  <CollectionCard collection={collection} />
                ))}
          </div>
          <EditProfileModal
            show={profileModal}
            onClose={() => setProfileModal(false)}
            // user={userDetails}
            user={foundUser}
          />
        </>
      )}
    </StyledProfile>
  );
}
const StyledProfile = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  min-height: 80vh;
  @media screen and (max-width: 900px) {
    position: absolute;
    padding-bottom: 15%;
  }
  padding: 0rem 4rem;
  .profile {
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
  }
  .cards {
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
`;
