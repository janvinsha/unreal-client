import React, { useContext } from 'react';
import styled from 'styled-components';

import { motion } from 'framer-motion';

//Icons

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
const Footer = ({ theme }) => {
  return (
    <StyledFooter theme_={theme}>
      <div className="icons">
        <a href="http://www.twitter.com/janvinsha" target="_blank">
          {' '}
          <TwitterIcon className="icon" />
        </a>

        <a
          href="https://www.linkedin.com/in/jande-vincent-1650431b9"
          target="_blank"
        >
          <LinkedInIcon className="icon" />
        </a>
        <a href="http://github.com/janvinsha" target="_blank">
          <GitHubIcon className="icon" />
        </a>
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled(motion.div)`
  padding: 2rem;
  display: flex;
  justify-content: center;
  margin-top: 6rem;
  @media screen and (max-width: 900px) {
    margin-top: 3rem;
  }

  .icons {
    width: 15rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      font-size: 2rem;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      &:hover {
        color: #50c1e9;
      }
    }
  }
`;
export default Footer;
