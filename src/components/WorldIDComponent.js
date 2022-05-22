import { ethers } from 'ethers';
import worldID from '@worldcoin/id';
import React from 'react';

const WorldIDComponent = ({ signal, setProof }) => {
  const enableWorldID = async () => {
    try {
      const result = await worldID.enable();
      setProof(result);
      console.log('World ID verified successfully: ', result);
    } catch (error) {
      console.error(error);
      enableWorldID().catch(console.error.bind(console));
    }
  };
  React.useEffect(() => {
    if (!worldID.isInitialized()) {
      worldID.init('world-id-container', {
        actionId: '0x32D59776E91fdb3F377755e12cEC05d9067c2B4F',
        signal,
      });
    }
    if (!worldID.isEnabled()) {
      enableWorldID().catch(console.error.bind(console));
    }
  }, []);
  return <div id="world-id-container"></div>;
};

export default WorldIDComponent;
