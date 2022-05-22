import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';

import SearchIcon from '@mui/icons-material/Search';

const HomeSearch = ({ preValue }) => {
  const { theme } = useContext(AppContext);

  const navigate = useNavigate();
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length > 0) {
      navigate(`/explore?q=${text}`);
    }
  }, [text]);
  return (
    <StyledHomeSearch theme_={theme}>
      <div className="search">
        <SearchIcon className="icon" />
        <input
          value={preValue || text}
          onChange={e => setText(e.target.value)}
          placeholder="Search"
        />
      </div>
    </StyledHomeSearch>
  );
};
const StyledHomeSearch = styled.div`
  width: 100%;
  .search {
    padding: 0.35rem 1rem;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .icon {
      color: #ccc;
    }
    input {
      background: inherit;
      border: none;
      font-size: 1rem;
      outline: none;
      color: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
      height: auto;
      width: 100%;
    }
  }
`;
export default HomeSearch;
