import styled from 'styled-components';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
const Hambuger = ({ onClick, open }) => {
  const { theme } = useContext(AppContext);
  return (
    <StyledHam onClick={onClick} open={open} theme_={theme}>
      <div className="bar top"></div>
      <div className="bar mid"></div>
      <div className="bar bottom"></div>
    </StyledHam>
  );
};

const StyledHam = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  height: 2rem;
  width: 2rem;
  cursor: pointer;

  .top {
    transform: ${({ open }) => (open ? 'rotate(45deg) ' : '')};
  }
  .mid {
    opacity: ${({ open }) => (open ? '0' : '')};
  }

  .bottom {
    transform: ${({ open }) => (open ? 'rotate(-45deg) ' : '')};
  }

  .bar {
    height: 3px;
    background: ${({ theme_ }) => (theme_ ? 'white' : 'black')};
    border-radius: 5px;
    margin: 2px 0px;
    transform-origin: left;
    transition: all 0.5s;
  }
`;

export default Hambuger;
