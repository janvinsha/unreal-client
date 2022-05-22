import React from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import PageloaderData from '../assets/animations/loader.json';
function PageLoader({ visible = false }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PageloaderData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (!visible) return null;
  return (
    <StyledContainer data-testid="container">
      <Lottie
        options={defaultOptions}
        height={200}
        width={200}
        // isStopped={this.state.isStopped}
        // isPaused={this.state.isPaused}
      />
    </StyledContainer>
  );
}

const StyledContainer = styled(motion.div)`
  display: flex;
  position: absolute;

  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default PageLoader;
