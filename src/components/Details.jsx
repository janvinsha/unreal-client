import { SpaceBarOutlined } from '@mui/icons-material';
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import AppContext from '../context/AppContext';
import Modal from './Modal';
import { CreateComment, Comment } from './index';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';

import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import defPic from '../assets/images/bg.jpg';

import collectApi from '../api/collect';
import userApi from '../api/user';

import useApi from '../hooks/useApi';
const Details = ({ post, setShare, comments }) => {
  const { theme, accountDetails } = useContext(AppContext);

  const doesFollow = useApi(userApi.doesFollow);

  const collect = useApi(collectApi.collect);
  useEffect(() => {
    if (post?.profile?.id) {
      // getLiked.request({
      //   walletAddress: `${post?.profile?.ownedBy}`,
      //   publicationIds: `[${post?.id}]`,
      // });
      doesFollow.request({
        followerAddress: accountDetails?.ownedBy,
        profileId: post?.profile?.id,
      });
    }
  }, [post?.profile?.id, accountDetails?.id]);
  // console.log('IS POST LIKED', getLiked.data);
  let follows = doesFollow.data?.doesFollow?.[0]?.follows;
  console.log('POST USER FOLLOW', follows);
  const collectHandler = () => {
    if (follows) {
      collect.request({
        publicationId: `${post?.profile?.id}`,
      });
    } else {
      alert('Follow user to be able to collect their posts');
    }
  };
  return (
    <StyledDetails theme_={theme}>
      <div className="details">
        <div className="post-header">
          <span className="dp">
            <Link to={`/${post?.profile?.handle}`}>
              <img
                src={post?.profile?.picture?.original?.url || defPic}
                alt="img"
              />
            </Link>
          </span>
          <span>
            <Link to={`/${post?.profile?.handle}`}>
              {post?.profile?.handle}
            </Link>
          </span>
        </div>{' '}
        <span className="text"> {post?.metadata?.content}</span>
        {post?.metadata?.media[0]?.original?.mimeType.startsWith('image') && (
          <div className="media">
            <img src={post?.metadata?.media[0]?.original?.url} />
          </div>
        )}
        {post?.metadata?.media[0]?.original?.mimeType.startsWith('video') && (
          <div className="media">
            <video controls autoplay>
              <source
                src={post?.metadata?.media[0]?.original?.url}
                type="video/mp4"
              />
            </video>
          </div>
        )}
        <div className="post-footer">
          <button className="plain-btn">
            <h3>{post?.stats?.totalAmountOfComments}</h3> <CommentIcon />
          </button>
          <button className="plain-btn" onClick={collectHandler}>
            {post?.stats?.totalAmountOfCollects} <LibraryAddIcon />
            {collect?.loading ? '...' : ''}
          </button>
          <button className="plain-btn" onClick={() => setShare(true)}>
            <ShareIcon />
          </button>
        </div>
      </div>

      <span className="comment-title">
        <h3>Comments</h3>
      </span>
      <CreateComment post={post} />
      <div className="comments">
        {comments &&
          comments.map(comment => (
            <Comment comment={comment} setShare={setShare} url={`/`} />
          ))}
      </div>
    </StyledDetails>
  );
};
const StyledDetails = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  @media screen and (max-width: 900px) {
    gap: 0rem;
  }
  .details {
    background: ${({ theme_ }) =>
      theme_ ? 'rgb(23, 24, 24,0.9)' : 'rgb(248, 248, 248,0.9)'};
    border-radius: 0.5rem;
    display: flex;
    flex-flow: column wrap;
    font-size: 1.2rem;
    overflow: hidden;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;

    @media screen and (max-width: 900px) {
      -moz-box-shadow: 0 0 3px #ccc;
      -webkit-box-shadow: 0 0 3px #ccc;
      box-shadow: 0 0 3px #ccc;
      clip-path: inset(0px 0px -15px 0px);
      border-radius: 0rem;
    }
    .post-header {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;

      padding: 0rem 1rem;
      padding-top: 1rem;
      .dp {
        border-radius: 50%;
        background: grey;
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .text {
      padding: 1rem 1rem;
      cursor: pointer;
    }
    .media {
      height: auto;
      img,
      video {
        width: 100%;
        height: 100%;
      }
    }
    .post-footer {
      padding: 1rem 1rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      @media screen and (max-width: 900px) {
        padding: 0.5rem 1rem;
      }
    }
  }
  .comment-title {
    h3 {
      font-size: 1.3rem;
      font-weight: 500;
    }
    @media screen and (max-width: 900px) {
      padding: 1rem;
      padding-top: 2rem;
    }
  }
  .comments {
    display: flex;
    flex-flow: column wrap;
    background: ${({ theme_ }) =>
      theme_ ? 'rgb(23, 24, 24,0.9)' : 'rgb(248, 248, 248,0.9)'};
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
    }
  }
`;
export default Details;
