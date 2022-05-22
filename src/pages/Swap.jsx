import { useState, useEffect, useMemo, useContext } from 'react';
// import { useMoralis } from "react-moralis";
// import InchModal from "./components/InchModal";
// import useInchDex from "hooks/useInchDex";

import {
  Input,
  Input as InputNumber,
  Image,
  Modal,
  Text,
} from '@chakra-ui/react';
import { TokensModal } from '../components';

// import { useTokenPrice } from 'react-moralis';
// import { tokenValue } from 'helpers/formatters';
// import { getWrappedNative } from 'helpers/networks';
// import { useOneInchQuote } from "react-moralis";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AppContext from '../context/AppContext';

function DEX() {
  // const { trySwap, tokenList, getQuote } = useInchDex(chain);

  // // const { Moralis, isInitialized, chainId } = useMoralis();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const tokenList = [];
  // const [quote, setQuote] = useState();
  // const [currentTrade, setCurrentTrade] = useState();
  // const { fetchTokenPrice } = useTokenPrice();
  // const [tokenPricesUSD, setTokenPricesUSD] = useState({});

  // console.log(tokenList, 'TOKEN_LIST');
  // const tokens = useMemo(() => {
  //   return { ...customTokens, ...tokenList };
  // }, [customTokens, tokenList]);

  // const fromTokenPriceUsd = useMemo(
  //   () =>
  //     tokenPricesUSD?.[fromToken?.['address']]
  //       ? tokenPricesUSD[fromToken?.['address']]
  //       : null,
  //   [tokenPricesUSD, fromToken]
  // );

  // const toTokenPriceUsd = useMemo(
  //   () =>
  //     tokenPricesUSD?.[toToken?.['address']]
  //       ? tokenPricesUSD[toToken?.['address']]
  //       : null,
  //   [tokenPricesUSD, toToken]
  // );

  // const fromTokenAmountUsd = useMemo(() => {
  //   if (!fromTokenPriceUsd || !fromAmount) return null;
  //   return `~$ ${(fromAmount * fromTokenPriceUsd).toFixed(4)}`;
  // }, [fromTokenPriceUsd, fromAmount]);

  // const toTokenAmountUsd = useMemo(() => {
  //   if (!toTokenPriceUsd || !quote) return null;
  //   return `~$ ${(
  //     Moralis?.Units?.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals) *
  //     toTokenPriceUsd
  //   ).toFixed(4)}`;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [toTokenPriceUsd, quote]);

  // // tokenPrices
  // useEffect(() => {
  //   if (!isInitialized || !fromToken || !chain) return null;
  //   const validatedChain = chain ? getChainIdByName(chain) : chainId;
  //   const tokenAddress = IsNative(fromToken['address'])
  //     ? getWrappedNative(validatedChain)
  //     : fromToken['address'];
  //   fetchTokenPrice({
  //     params: { chain: validatedChain, address: tokenAddress },
  //     onSuccess: price =>
  //       setTokenPricesUSD({
  //         ...tokenPricesUSD,
  //         [fromToken['address']]: price['usdPrice'],
  //       }),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chain, isInitialized, fromToken]);

  // useEffect(() => {
  //   if (!isInitialized || !toToken || !chain) return null;
  //   const validatedChain = chain ? getChainIdByName(chain) : chainId;
  //   const tokenAddress = IsNative(toToken['address'])
  //     ? getWrappedNative(validatedChain)
  //     : toToken['address'];
  //   fetchTokenPrice({
  //     params: { chain: validatedChain, address: tokenAddress },
  //     onSuccess: price =>
  //       setTokenPricesUSD({
  //         ...tokenPricesUSD,
  //         [toToken['address']]: price['usdPrice'],
  //       }),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chain, isInitialized, toToken]);

  // useEffect(() => {
  //   if (!tokens || fromToken) return null;
  //   setFromToken(tokens[nativeAddress]);
  // }, [tokens, fromToken]);

  // const ButtonState = useMemo(() => {
  //   if (chainIds?.[chainId] !== chain)
  //     return { isActive: false, text: `Switch to ${chain}` };

  //   if (!fromAmount) return { isActive: false, text: 'Enter an amount' };
  //   if (fromAmount && currentTrade) return { isActive: true, text: 'Swap' };
  //   return { isActive: false, text: 'Select tokens' };
  // }, [fromAmount, currentTrade, chainId, chain]);

  // useEffect(() => {
  //   if (fromToken && toToken && fromAmount)
  //     setCurrentTrade({ fromToken, toToken, fromAmount, chain });
  // }, [toToken, fromToken, fromAmount, chain]);

  // useEffect(() => {
  //   if (currentTrade) getQuote(currentTrade).then(quote => setQuote(quote));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentTrade]);

  // const PriceSwap = () => {
  //   const Quote = quote;
  //   if (!Quote || !tokenPricesUSD?.[toToken?.['address']]) return null;
  //   if (Quote?.statusCode === 400) return <>{Quote.message}</>;
  //   console.log(Quote);
  //   const { fromTokenAmount, toTokenAmount } = Quote;
  //   const { symbol: fromSymbol } = fromToken;
  //   const { symbol: toSymbol } = toToken;
  //   const pricePerToken = parseFloat(
  //     tokenValue(fromTokenAmount, fromToken['decimals']) /
  //       tokenValue(toTokenAmount, toToken['decimals'])
  //   ).toFixed(6);
  //   return (
  //     <Text style={styles.priceSwap}>
  //       Price:{' '}
  //       <Text
  //         style={{ color: 'white' }}
  //       >{`1 ${toSymbol} = ${pricePerToken} ${fromSymbol} ($${tokenPricesUSD[
  //         [toToken['address']]
  //       ].toFixed(6)})`}</Text>
  //     </Text>
  //   );
  // };
  const { theme, accountDetails } = useContext(AppContext);

  return (
    <>
      <StyledDex theme_={theme}>
        <h2>Cross Chain Swap(Swing)</h2>
        <div className="dex">
          <motion.div className="row">
            <h3>From</h3>
            <div className="input-row">
              <div className="row-input-div">
                <InputNumber
                  type="number"
                  placeholder="0.00"
                  className="row-input"
                  // onChange={e => setFromAmount(e.target.value)}
                  // value={fromAmount}
                  focusBorderColor="#0b172e"
                />
                {/* <h3>{fromTokenAmountUsd}</h3> */}
              </div>
              <button
                className="token-btn"
                onClick={() => setFromModalActive(true)}
              >
                {/* {fromToken ? ( */}
                {true ? (
                  <Image
                    src={
                      // fromToken?.logoURI ||
                      'https://etherscan.io/images/main/empty-token.png'
                    }
                    alt="nologo"
                    width="30px"
                    preview={false}
                    style={{ borderRadius: '15px' }}
                  />
                ) : (
                  <span>Select a token</span>
                )}
                {/* <span>{fromToken?.symbol}</span> */}
                <Arrow />
              </button>
            </div>
          </motion.div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px',
            }}
          >
            <ArrowDownwardIcon />
          </div>
          <motion.div className="row">
            <h3>To</h3>
            <div className="input-row">
              <div className="row-input-div">
                <Input
                  className="row-input down"
                  placeholder="0.00"
                  readOnly
                  // value={
                  //   quote
                  //     ? parseFloat(
                  //         Moralis?.Units?.FromWei(
                  //           quote?.toTokenAmount,
                  //           quote?.toToken?.decimals
                  //         )
                  //       ).toFixed(6)
                  //     : ''
                  // }
                />
                {/* <h3>{toTokenAmountUsd}</h3> */}
              </div>
              <button
                className="token-btn"
                onClick={() => setToModalActive(true)}
                // type={toToken ? 'default' : 'primary'}
              >
                {/* {toToken ? ( */}
                {false ? (
                  <Image
                    src={
                      // toToken?.logoURI ||
                      'https://etherscan.io/images/main/empty-token.png'
                    }
                    alt="nologo"
                    width="30px"
                    preview={false}
                    style={{ borderRadius: '15px' }}
                  />
                ) : (
                  <span>Select a token</span>
                )}
                {/* <span>{toToken?.symbol}</span> */}
                <Arrow />
              </button>
            </div>
          </motion.div>
          {/* {quote && (
            <div>
              <span className="gas-texts">
                <h3>Estimated Gas:</h3> <h3>{quote?.estimatedGas}</h3>
              </span>
              <PriceSwap />
            </div>
          )} */}
          <button
            type="primary"
            size="large"
            className="swap-btn"
            // onClick={() => trySwap(currentTrade)}
            // disabled={!ButtonState.isActive}
          >
            {/* {ButtonState.text} */}
            Swap
          </button>
        </div>
      </StyledDex>

      <TokensModal
        title="Select a token"
        show={isFromModalActive}
        onClose={() => setFromModalActive(false)}
        setFromToken={setFromToken}
        tokenList={tokenList}
      />
      <TokensModal
        title="Select a token"
        setToken={setToToken}
        onClose={() => setToModalActive(false)}
        show={isToModalActive}
        tokenList={tokenList}
      />
    </>
  );
}

const StyledDex = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0rem;
  h3 {
  }
  .dex {
    width: 28rem;
    padding: 1.5rem 1rem 1rem 1rem;
    border-radius: 0.5rem;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-flow: column wrap;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
    gap: 0.5rem;
    @media (max-width: 900px) {
      width: 100%;
    }
    .row {
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      .token-btn {
        display: flex;
        align-items: center;
        gap: 0.1rem;
        outline: none;
      }
      .input-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        -moz-box-shadow: 0 0 3px #ccc;
        -webkit-box-shadow: 0 0 3px #ccc;
        box-shadow: 0 0 3px #ccc;
        border-radius: 0.5rem;
        padding: 1rem;
        .row-input-div {
          padding: 0.5rem;
          .row-input {
            display: flex;
            background: none;

            border: none;
            outline: none;
          }
        }
      }
    }
    .gas-texts {
      display: flex;
      gap: 1rem;
    }
    .swap-btn {
      margin-top: 0.5rem;

      padding: 0.6rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.2rem;
      /* &:disabled {
        background-color: red;
      } */
    }
  }
`;

export default DEX;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
