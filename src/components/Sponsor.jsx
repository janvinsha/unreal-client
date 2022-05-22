import React, { useContext } from 'react';

import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppContext from '../context/AppContext';

const Sponsor = ({ sponsor }) => {
  const { theme } = useContext(AppContext);
  let navigate = useNavigate();
  return (
    <StyledSponsor theme_={theme} onClick={() => navigate('/nfts/123')}>
      <span>
        <h2>{sponsor.name}</h2>
      </span>
      <span className="image">
        <img src={sponsor.img} />
      </span>
      <span className="about">
        <p>{sponsor.about}</p>
      </span>
    </StyledSponsor>
  );
};

const StyledSponsor = styled(motion.div)`
  width: 100%;
  padding: 2rem 2rem;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  gap: 1rem;
  background: ${({ theme_ }) =>
    theme_ ? 'rgb(23, 24, 24,0.9)' : 'rgb(248, 248, 248,0.9)'};
  background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
  cursor: pointer;

  -moz-box-shadow: 0 0 4.5px #ccc;
  -webkit-box-shadow: 0 0 4.5px #ccc;
  box-shadow: 0 0 4.5px #ccc;

  .image {
    width: 6rem;
    height: 6rem;
    overflow: hidden;
    border-radius: 5rem;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default Sponsor;
