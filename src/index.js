import React, { StrictMode } from 'react';
import { ApolloProvider } from '@apollo/client';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/react';
import _ from 'underscore';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import client from './apollo';

import { Integrations } from '@sentry/tracing';
// import after NETWORK_CONFIGs is initialized
import Wallet from './utils/wallet';
import TokenListManager from './utils/tokenList';
import GlobalStateManager from './utils/global';
import SwapFn from './utils/swapFn';
// import Nxtp from './utils/nxtp';
import HopUtils from './utils/hop';
import TxQueue from './utils/txQueue';
// import Storage from './utils/storage';

const IS_MAIN_NETWORK = (window.IS_MAIN_NETWORK =
  process.env.IS_MAIN_NETWORK === 'true');
window.IS_PRODUCTION = process.env.IS_PRODUCTION;

if (process.env.IS_PRODUCTION) {
  Sentry.init({
    dsn: process.env.SENTRY_JS_DSN,
    environment: IS_MAIN_NETWORK ? 'production' : 'development',
    integrations: [new Integrations.BrowserTracing()],
    release: `${process.env.HEROKU_APP_NAME}-${process.env.HEROKU_RELEASE_VERSION}`,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

window.ethers = ethers;
window._ = _;
window.BN = BN;
window.BigNumber = ethers.BigNumber;

if (IS_MAIN_NETWORK) {
  console.log('Loading MAIN config...');
} else {
  console.log('Loading TEST config...');
}

// const config =  fetch(
//   IS_MAIN_NETWORK ? '/config/main.config.json' : '/config/test.config.json',
// );
// window.NETWORK_CONFIGS = await config.json();
window.MAX_RETRIES = process.env.IS_PRODUCTION ? 3 : 1;

// pre-load and collase/parallelize all our external JSON config loading
// to reduce initial app load times
// Promise.all([Wallet.initializeAbis(), TokenListManager.initializeTokenLists()]);

// Storage.initialize();
// TokenListManager.initialize();
// TokenListManager.updateTokenList();
// GlobalStateManager.initialize();
// Wallet.initialize();

// SwapFn.initialize();
//  Nxtp.initalize();
// TxQueue.initialize();

if (Wallet.isMetamaskSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
