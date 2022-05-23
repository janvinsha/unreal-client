import { useState, useEffect, useContext } from 'react';
import * as React from 'react';
import axios from 'axios';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Waku, WakuMessage } from 'js-waku';

// import protons from 'protons';
import protobuf from 'protobufjs';

import ScrollContainer from 'react-indiana-drag-scroll';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import {
  NftCard,
  Sponsor,
  ShareModal,
  Comment,
  CreateComment,
  Loader,
} from '../components';
import AppContext from '../context/AppContext';

import { pageAnimation } from '../animation';

import defPic from '../assets/images/HM.png';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const SimpleChatMessage = new protobuf.Type('SimpleChatMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('text', 2, 'string'));

export default function NftDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const nftId = pathname.split('/')[2];
  const [loading, setLoading] = useState(false);
  const { theme, buyingNft, buyNft, currentAccount } = useContext(AppContext);
  const [share, setShare] = useState(false);
  const [text, setText] = useState('');
  const tabs = ['Description', 'History'];
  const [activeTab, setActiveTab] = useState('Description');
  let comments = [];
  let nft = { tokenId: 1 };
  let COVALENT_KEY = 'ckey_9ebee12fd55e4e05b33496e5c7e';

  let [nftData, setNftData] = useState();
  let data;
  const getData = async () => {
    try {
      data = await axios.get(
        `https://api.covalenthq.com/v1/80001/tokens/0xE9352F25795c89493e171D5d32A2350A2b3Bd8Fc/nft_transactions/${nft.tokenId}/?quote-currency=USD&format=JSON&key=ckey_9ebee12fd55e4e05b33496e5c7e`
      );
      setNftData(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const ContentTopic = `/unreal-market/0/nft-comment/0xE9352F25795c89493e171D5d32A2350A2b3Bd8Fc/proto`;
  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState('None');
  // Using a counter just for the messages to be different
  const [sendCounter, setSendCounter] = React.useState(0);
  const [messages, setMessages] = React.useState();

  React.useEffect(() => {
    if (!!waku) return;
    if (wakuStatus !== 'None') return;

    setWakuStatus('Starting');

    Waku.create({ bootstrap: { default: true } }).then(waku => {
      setWaku(waku);
      setWakuStatus('Connecting');
      waku.waitForRemotePeer().then(() => {
        setWakuStatus('Ready');
      });
    });
  }, [waku, wakuStatus]);

  const processIncomingMessage = React.useCallback(wakuMessage => {
    if (!wakuMessage.payload) return;

    const { text, timestamp } = SimpleChatMessage.decode(wakuMessage.payload);

    const time = new Date();
    time.setTime(timestamp);
    const message = { text, timestamp: time };

    setMessages(messages => {
      return [message].concat(messages);
    });
  }, []);

  React.useEffect(() => {
    if (!waku) return;

    // Pass the content topic to only process messages related to your dApp
    waku.relay.addObserver(processIncomingMessage, [ContentTopic]);

    // `cleanUp` is called when the component is unmounted, see ReactJS doc.
    return function cleanUp() {
      waku.relay.deleteObserver(processIncomingMessage, [ContentTopic]);
    };
  }, [waku, wakuStatus, processIncomingMessage]);

  const sendMessageOnClick = () => {
    // Check Waku is started and connected first.
    if (wakuStatus !== 'Ready') return;

    sendMessage(`${text} #${sendCounter}`, waku, new Date()).then(() =>
      alert('Message sent')
    );

    // For demonstration purposes.
    setSendCounter(sendCounter + 1);
  };

  function sendMessage(message, waku, timestamp) {
    const time = timestamp.getTime();

    // Encode to protobuf
    const protoMsg = SimpleChatMessage.create({
      timestamp: time,
      text: message,
    });
    const payload = SimpleChatMessage.encode(protoMsg).finish();

    // Wrap in a Waku Message
    return WakuMessage.fromBytes(payload, ContentTopic).then(wakuMessage =>
      // Send over Waku Relay
      waku.relay.send(wakuMessage)
    );
  }
  let history = nftData?.data?.data?.items[0]?.nft_transactions;

  const GET_NFT_QUERY = gql`
    query GetNft($id: String) {
      marketItems(first: 1, where: { tokenId: $id }) {
        id
        tokenId
        seller
        owner
        price
        sold
        collectionId
        name
        image
        category
        description
        tags
      }
    }
  `;

  const { data: resultData } = useQuery(GET_NFT_QUERY, {
    variables: { id: nftId },
  });

  console.log('THIS IS THE NFT DATA', resultData);

  const GET_PROFILE_QUERY = gql`
    query GetProfile($id: String) {
      profiles(first: 1, where: { profileId_contains: $id }) {
        id
        profileId
        banner
        dp
        name
      }
    }
  `;

  const { data: getProfileData } = useQuery(GET_PROFILE_QUERY, {
    variables: { id: `0xFF3e7fD8994d7dbEcdCfFA54EDcAaf6A8DB2CbF8` },
  });
  let userProfile = getProfileData?.profiles[0];
  return (
    <StyledNftDetails
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <Loader visible={buyingNft} />
      <div className="desc">
        <div className="left">
          <img src={defPic} alt="img" />
        </div>

        <div className="right">
          <h2>HackMoney (2022)</h2>
          <span className="author">
            <img src={userProfile?.dp || defPic} alt="img" />{' '}
            <Link to={`/profile/${userProfile?.id}`}>
              {userProfile?.name || 'Comrade'}
            </Link>
          </span>
          <span className="tabs">
            {tabs.map((tab, index) => (
              <span
                className={`tab ${activeTab === tab && 'active'}`}
                key="index"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <div className="line"></div>
              </span>
            ))}
          </span>

          <div>
            {activeTab == 'Description' ? (
              <div className="descr">
                <p>Build the future of Finance</p>
                <span className="price">
                  <span>Price</span>
                  <h2>1 ETH</h2>
                </span>
                <span className="price">
                  <span>Collection</span>{' '}
                  <Link to="/collections/2">Ethglobal</Link>
                </span>
                <div className="buy">
                  <button onClick={() => buyNft(nft?.tokenId)}>Buy NFT</button>
                </div>
                <div className="interact">
                  <button className="plain-btn" onClick={() => setShare(true)}>
                    <ShareIcon />
                  </button>
                </div>
              </div>
            ) : activeTab == 'History' ? (
              <ScrollContainer className="historys">
                {history &&
                  history?.map((transaction, index) => (
                    <div className="history">
                      <span className="title">
                        Transaction {history?.length - index}
                      </span>
                      <span className="row">
                        <h4>Txn Hash</h4>
                        <h4>{transaction?.tx_hash?.slice(0, 33)}</h4>
                        <h4>{transaction?.tx_hash?.slice(33)}</h4>
                      </span>
                      <span className="row">
                        <h4>From:</h4> <h4> {transaction?.from_address}</h4>
                      </span>
                      <span className="row">
                        <h4>To:</h4> <h4> {transaction?.to_address}</h4>
                      </span>
                      <span className="row">
                        <h4>Token ID:</h4>
                        <h4>{nft.tokenId}</h4>
                      </span>
                      <span className="row">
                        <h4>Token:</h4>
                        <h4>UTT</h4>
                      </span>
                    </div>
                  ))}
              </ScrollContainer>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <ShareModal show={share} onClose={() => setShare(false)} theme_={theme} />
      <span className="comment-title">
        <h2>Comments</h2>
      </span>
      <CreateComment
        nft={nft}
        text={text}
        setText={setText}
        sendMessageOnClick={sendMessageOnClick}
      />
      <div className="comments">
        {messages &&
          messages.map(message => (
            <Comment message={message} setShare={setShare} url={`/`} />
          ))}
      </div>
    </StyledNftDetails>
  );
}
const StyledNftDetails = styled(motion.div)`
  min-height: 81vh;
  display: flex;
  flex-flow: column wrap;

  padding: 2rem 4rem;
  gap: 1.5rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 0rem;
  }

  .author {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
  .comments {
    width: 50%;
    display: flex;
    flex-flow: column wrap;
    border-radius: 0.5rem;
    display: flex;
    flex-flow: column wrap;
    font-size: 1.2rem;
    overflow: hidden;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    @media screen and (max-width: 900px) {
      border-radius: 0rem;
      width: 100%;
    }
  }
  .tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    width: 100%;
    .tab {
      padding: 0rem 2rem;
      padding-top: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;
      &:hover {
        color: gray;
      }
      .line {
        margin-top: 0.5rem;
        padding: 2px;
        background: inherit;
        border-radius: 3rem 3rem 0px 0px;
      }
      &.active {
        .line {
          background: #d04bff;
        }
      }
    }
  }
  .desc {
    display: flex;
    flex-flow: row wrap;
    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 0rem 1rem;
      gap: 1rem;
    }
    .left {
      width: 50%;
      @media screen and (max-width: 900px) {
        width: 100%;
        height: 100%;
        padding-right: 0rem;
      }
      padding-right: 2rem;

      img {
        width: 100%;
        height: 100%;

        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
    .right {
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      padding: 2rem 4rem;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        padding: 0rem 0rem;
      }
      .descr {
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        text-align: center;
        @media screen and (max-width: 900px) {
          width: 100%;
        }
        .price {
          display: flex;
          flex-flow: column wrap;
          padding: 0.4rem 0rem;
          gap: 0.3rem;
          span {
            font-size: 1.4rem;
          }
          h2 {
            color: #d04bff;
            font-size: 1.2rem;
          }
          a {
            font-size: 1.2rem;
            color: #d04bff;
          }
        }
        .buy {
          padding: 0.5rem 0rem;
        }
        .interact {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 0rem;
        }
      }
      .creator {
        display: flex;
        flex-flow: row wrap;
        gap: 20rem;
        @media screen and (max-width: 900px) {
          gap: 1rem;
        }
        .creator-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
          }
        }
        h5 {
          color: #acacac;
        }
      }
    }
  }

  .historys {
    display: flex;
    width: 100%;
    flex-direction: column;
    cursor: grab;
    height: 15rem;
    overflow-y: scroll;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
    padding: 1rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    @media screen and (max-width: 900px) {
    }
    .history {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      -moz-box-shadow: 0 0 3px #ccc;
      -webkit-box-shadow: 0 0 3px #ccc;
      box-shadow: 0 0 3px #ccc;
      border: none;
      padding: 1rem;

      .title {
        text-align: center;
      }
      h4 {
        font-size: 0.8rem;
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }
`;
