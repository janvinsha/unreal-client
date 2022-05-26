import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import * as UAuthWeb3Modal from '@uauth/web3modal';
import UAuthSPA from '@uauth/js';

import Web3Modal from 'web3modal';

import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

import { GlobalStyle, Nav, Footer } from './components';
import { gql, useQuery } from '@apollo/client';
//

///
import {
  Home,
  CreateNft,
  CreateCollection,
  Profile,
  Swap,
  Airdrop,
  Vault,
  NftDetails,
  Explore,
  CollectionDetails,
} from './pages';
import AppContext from './context/AppContext';

import marketContract from './utils/marketContract.json';

const MARKET_CONTRACT_ADDRESS = '0xC601829461D2a431eaB664823990C96AFC215f4d';

const AIRDROP_CONTRACT_ADDRESS = '0x7992D9C75aBf9d0a7823d18f8c2A6346aAAD5d30';

export const uauthOptions = {
  clientID: 'client_id',
  redirectUri: 'http://localhost:3000',

  // Must include both the openid and wallet scopes.
  scope: 'openid wallet',
};

let providerOptions = {
  'custom-uauth': {
    // The UI Assets
    display: UAuthWeb3Modal.display,

    // The Connector
    connector: UAuthWeb3Modal.connector,

    // The SPA libary
    package: UAuthSPA,

    // The SPA libary options
    options: uauthOptions,
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: 'fdd5eb8e3a004c9c9caa5a91a48b92b6',
      chainId: 80001,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Unreal Marketplace',
      infuraId: 'fdd5eb8e3a004c9c9caa5a91a48b92b6',
      chainId: 80001,
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
  theme: `light`,
});

UAuthWeb3Modal.registerWeb3Modal(web3Modal);

const App = () => {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme')));
  const [sideNav, setSideNav] = useState(false);
  const [minting, setMinting] = useState(false);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [buyingNft, setBuyingNft] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [accountDetails, setAccountDetails] = useState();
  const [provider, setProvider] = useState();

  const [worldIDProof, setWorldIDProof] = useState(null);
  const [screen, setScreen] = React.useState();
  const [txHash, setTxHash] = React.useState(''); // hash of t

  const changeTheme = () => {
    setTheme(!theme);
    localStorage.setItem('theme', JSON.stringify(!theme));
  };

  const location = useLocation();
  const [currentAccount, setCurrentAccount] = useState('');

  console.log('LOGGIN HAS LOADED', hasLoaded);

  const checkIfWalletIsConnected = async () => {
    setHasLoaded(false);
    if (web3Modal.cachedProvider) {
      let wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);
      setProvider(tProvider);
      // You can list the connected accounts without launching Web3Modal
      const accounts = await tProvider?.listAccounts();

      console.log('CHECKING ACCOUNT ADDRESS', accounts[0]);
      //   console.log('Accounts', accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);

        console.log('Found an authorized account:', account);
        const signer = tProvider.getSigner();
        const connectedContract = new ethers.Contract(
          MARKET_CONTRACT_ADDRESS,
          marketContract.abi,
          signer
        );

        // let data = await connectedContract.fetchCollectionsOfAddress(account);
        // console.log('HERE ARE THE ITEMSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', data);
        console.log('Going to pop wallet now to pay gas...');
        let chainId = await signer.getChainId();
        if (chainId == 80001) {
        } else {
          alert('CONNECT TO POLYGON MATIC(TESTNET) TO CONTINUE');
        }

        // Setup listener! This is for the case where a user comes to our site
        // and ALREADY had their wallet connected + authorized.
      } else {
        console.log('No authorized account found');
      }

      // String, hex code of the chainId of the Rinkebey test network
    } else {
      setCurrentAccount();
    }
    setHasLoaded(true);
  };

  const connectWallet = async () => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    try {
      const wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);

      setProvider(tProvider);
      const accounts = await tProvider.listAccounts();
      const signer = tProvider.getSigner();
      setCurrentAccount(accounts[0]);

      setIsLoggedIn(true);
      setHasLoaded(true);
      checkIfWalletIsConnected();
    } catch (error) {
      console.log('CONNECT ERROR HERE', error);
    }
  };
  // const disconnectWeb3Modal = async () => {
  //   const wallet = await web3Modal.connect();
  //   const tProvider = new ethers.providers.Web3Provider(wallet);
  //   if (tProvider && tProvider.sequence) {
  //     const wallet = tProvider.sequence;
  //     wallet.disconnect();
  //   }
  //   web3Modal.clearCachedProvider();
  //   setCurrentAccount();

  // };

  const disconnectWeb3Modal = async () => {
    const wallet = await web3Modal.connect();
    web3Modal.clearCachedProvider();
    setCurrentAccount();
  };
  // useEffect(() => {
  // if (web3Modal.cachedProvider) {
  //   connectWallet();
  // }
  // }, []);

  const createCollection = async collection => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        MARKET_CONTRACT_ADDRESS,
        marketContract.abi,
        signer
      );
      setCreatingCollection(true);
      console.log(
        'Going to pop wallet now to pay gas..., for creatingCollection'
      );

      const tx = await connectedContract.createCollection(
        collection.banner,
        collection.dp,
        collection.name,
        collection.description,
        collection.tags
      );
      setCreatingCollection(false);
      console.log('Collection Created Successfully', tx);
      alert('Collection created successfully');
    } catch (error) {
      setCreatingCollection(false);
      console.log(error);
    }
  };

  const createItem = async item => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        MARKET_CONTRACT_ADDRESS,
        marketContract.abi,
        signer
      );
      setCreatingItem(true);
      console.log('Going to pop wallet now to pay gas..., for creatingitem');
      let listingPrice = await connectedContract.getListingPrice();

      const tx = await connectedContract.createToken(
        item.tokenURI,
        item.price,
        item.collection,
        item.name,
        item.image,
        item.category,
        item.description,
        item.tags,
        { value: listingPrice }
      );
      setCreatingItem(false);
      console.log('NFT Created Successfully', tx);
      alert('NFT created successfully');
    } catch (error) {
      setCreatingItem(false);
      console.log(error);
    }
  };

  const editProfile = async profile => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        MARKET_CONTRACT_ADDRESS,
        marketContract.abi,
        signer
      );
      setEditingProfile(true);
      let tx;
      // if (userProfile?.name) {
      //   tx = await connectedContract.editProfile(
      //     profile.banner,
      //     profile.dp,
      //     profile.name,
      //     profile.bio
      //   );
      // } else {
      tx = await connectedContract.createProfile(
        profile.banner,
        profile.dp,
        profile.name,
        profile.bio
      );
      // }

      setEditingProfile(false);
      console.log('Profile Edited Successfully', tx);
      alert('Profile Edited Successfully');
    } catch (error) {
      setEditingProfile(false);
      console.log(error);
    }
  };

  const buyNft = async id => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        MARKET_CONTRACT_ADDRESS,
        marketContract.abi,
        signer
      );
      setBuyingNft(true);

      let tx = await connectedContract.createMarketSale(id);
      // }

      setBuyingNft(false);
      console.log('Profile Edited Successfully', tx);
      alert('Bought NFT successfully');
    } catch (error) {
      setBuyingNft(false);
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    console.log('E dey here oo', web3Modal.cachedProvider);
  }, []);
  const claimAction = async () => {
    if (!worldIDProof) {
      throw 'World ID proof is missing.';
    }
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    const signer = tProvider.getSigner();
    const airdropContract = new ethers.Contract(
      AIRDROP_CONTRACT_ADDRESS,
      airdropContract.abi,
      signer
    );
    // eslint-disable-next-line
    let abi = ethers.utils.AbiCoder;
    const claimResult = await airdropContract.claim(
      currentAccount,
      worldIDProof.merkleRoot,
      worldIDProof.nullifierHash,
      abi.decode(['uint256[8]'], worldIDProof.proof)[0],
      { gasLimit: 10000000 }
    );
    setTxHash(claimResult.hash);
    console.log('Airdrop claimed successfully!', claimResult);
  };

  const claim = async () => {
    try {
      await claimAction();
      setScreen('Congratulations');
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  };

  const fetchNfts = async () => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    const signer = tProvider.getSigner();
    const connectedContract = new ethers.Contract(
      MARKET_CONTRACT_ADDRESS,
      marketContract.abi,
      signer
    );

    let da = await connectedContract.fetchMarketItems();
    return da;
  };

  return (
    <AppContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,

        minting,
        setMinting,
        fetchNfts,
        connectWallet,
        createItem,
        disconnectWeb3Modal,
        hasLoaded,
        accountDetails,
        isLoggedIn,
        creatingItem,
        theme,
        setTheme,
        changeTheme,
        sideNav,
        setSideNav,
        creatingCollection,
        createCollection,
        worldIDProof,
        setWorldIDProof,
        claim,
        editProfile,
        editingProfile,
        userProfile,
        buyNft,
        buyingNft,
      }}
    >
      <div className="App">
        <GlobalStyle theme={theme} />
        <Nav userProfile={userProfile} />
        <AnimatePresence exitBeforeEnter>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create-nft" element={<CreateNft />} />
            <Route path="/create-collection" element={<CreateCollection />} />
            <Route path="/exchange" element={<Swap />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/airdrop" element={<Airdrop />} />

            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/nfts/:id" element={<NftDetails />} />
            <Route path="/collections/:id" element={<CollectionDetails />} />
          </Routes>
        </AnimatePresence>
        <Footer theme={theme} />
      </div>
    </AppContext.Provider>
  );
};

export default App;
