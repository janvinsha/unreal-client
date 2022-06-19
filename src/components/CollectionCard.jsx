import React, { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';
import nftImg from '../assets/images/HM.png';
import defPic from '../assets/images/bg.png';
const CollectionCard = ({ collection }) => {
  const { theme } = useContext(AppContext);
  let navigate = useNavigate();
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
    variables: { id: `0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39` },
  });
  let userProfile = getProfileData?.profiles[0];
  return (
    <StyledCollectionCard
      theme_={theme}
      onClick={() => navigate('/collections/3')}
    >
      <img src={nftImg} alt="img" />
      <div className="nft-desc">
        <span className="title">
          <h3>Encode</h3>
        </span>

        <span className="sale">
          <span className="author">
            {' '}
            <img src={userProfile?.dp || defPic} alt="img" />
            <small>{userProfile?.name || 'Comrade'}</small>{' '}
          </span>{' '}
          <p>Author</p>
        </span>
      </div>
    </StyledCollectionCard>
  );
};

const StyledCollectionCard = styled(motion.div)`
  width: 100%;
  padding: 0rem 0rem;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  background: ${({ theme_ }) =>
    theme_ ? 'rgb(23, 24, 24,0.9)' : 'rgb(248, 248, 248,0.9)'};
  background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
  cursor: pointer;
  &:hover {
    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
  }

  overflow: hidden;
  img {
    height: 15rem;
    width: 100%;
    object-fit: cover;
  }
  height: 21rem;
  display: flex;
  flex-flow: column wrap;

  .nft-desc {
    display: flex;
    flex-flow: column wrap;
    padding: 0rem 1rem;
    gap: 0.5rem;

    .title,
    .sale {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;

      img {
        width: 1.5rem;
        height: 1.5rem;
        object-fit: cover;
        border-radius: 50%;
        @media screen and (max-width: 900px) {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .title {
      h3 {
        font-weight: 500;
      }
      p {
        color: #d04bff;
      }
    }
    .sale {
      .author {
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
    }
  }
`;

export default CollectionCard;
