import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';

import ShareIcon from '@mui/icons-material/Share';

import defPic from '../assets/images/bg.jpg';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const Comment = ({ message, setShare }) => {
  const { theme, accountDetails } = useContext(AppContext);
  const navigate = useNavigate();

  const timeago = moment().fromNow();
  return (
    <StyledComment theme_={theme}>
      <span className="text"> {message} </span>
    </StyledComment>
  );
};
const StyledComment = styled.div`
  display: flex;
  flex-flow: column wrap;
  font-size: 1.2rem;
  overflow: hidden;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  clip-path: inset(0px 0px -15px 0px);
  padding: 1rem 0rem;
  background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
  width: 100%;

  .text {
    padding: 1rem 1rem;
    cursor: pointer;
  }

  .comment-footer {
    padding: 0rem 1rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
`;
export default Comment;
