import React, { FC, useEffect, useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import Input from '../components/Input';
import Filter from '../components/Filter';
import Textarea from '../components/Textarea';
import TagInput from '../components/TagInput';
import { Loader } from '../components';
import AppContext from '../context/AppContext';
import { pageAnimation } from '../animation';
import PhotoIcon from '@mui/icons-material/Photo';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});
const CreateNft = ({ show, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [collection, setCollection] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [hashtags, setHashtags] = useState([]);
  const hiddenDpInput = React.useRef(null);
  const [dp, setDp] = useState();

  const {
    theme,
    createItem,
    creatingItem,
    currentAccount,
    connectWallet,
    fetchCollections,
  } = useContext(AppContext);

  const categories = [];
  const handleDpClick = event => {
    hiddenDpInput.current.click();
  };

  const uploadDpHandler = async e => {
    const file = e.target.files[0];
    console.log('This is the file', file);
    if (file.type.startsWith('image')) {
      setDp(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (!currentAccount) {
      connectWallet();
      return;
    }
    if (!dp) {
      alert('Upload Photo');
      return;
    }

    try {
      let photo = await client.add(dp);
      let photoUrl = `https://unreal-client.infura-ipfs.io/ipfs/${photo.path}`;

      console.log('IPFS UPLOAD FILE PHOTOURL', photoUrl);
      // console.log('FILES ARE HERE', files, dpFiles);

      console.log('Collection details', name, description, hashtags);

      let result = await client.add(
        JSON.stringify({
          name: name,
          description: description,
          image: photoUrl,
        })
      );
      console.log('Token  uri result', result);
      const upPrice = ethers.utils.parseUnits(price.toString(), 'ether');
      createItem({
        tokenURI: `https://unreal-client.infura-ipfs.io/ipfs/${result.path}`,
        price: upPrice,
        collection,
        name,
        image: photoUrl,
        category,
        description,
        tags: hashtags,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const GET_USER_COLLECTIONS_QUERY = gql`
    query GetUserCollections($owner: Bytes) {
      collections(where: { owner_contains: $owner }) {
        name
      }
    }
  `;
  const { data, loading, error } = useQuery(GET_USER_COLLECTIONS_QUERY, {
    variables: { owner: currentAccount },
  });

  console.log('HERE ARE THE USERS COLLECTIONS', data);
  let foundCollections = [];

  let collections = data?.collections;
  let arrayWork = () => {
    if (collections) {
      for (let x of collections) {
        let tempObject = {
          label: x?.name,
          value: x?.name,
        };
        foundCollections.push(tempObject);
      }
    }
  };
  arrayWork();

  return (
    <StyledCreateNft
      exit="exit"
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      theme_={theme}
    >
      <Loader visible={creatingItem} />
      <motion.div className="page_header">
        <h2 className="page_title text-gradient">Create new Item</h2>
      </motion.div>
      <motion.div className="page_container">
        <div className="upload_div">
          <div className="img_input ">
            <div className="box">
              {dp?.preview ? (
                <>
                  <img src={dp.preview} />
                </>
              ) : (
                <>
                  <h3>PNG, JPEG, GIF, WEBP</h3>
                  <h3>Max 100mb</h3>
                  <PhotoIcon className="icon" />
                  <h3>Drag and drop the file here or</h3>
                  <h3> click button select</h3>
                  <button className="plain-btn" onClick={handleDpClick}>
                    Select file
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="preview_div">
          <form onSubmit={submitHandler}>
            <Input
              name="name"
              label="Name"
              asterik={true}
              placeholder="Item Name"
              onChange={e => setName(e.target.value)}
              required
              theme={theme}
            />

            <Filter
              name="Category"
              label="Category"
              asterik={true}
              defaultValue="art"
              className="border"
              options={[
                { label: 'Art', value: 'art' },
                { label: 'Pictures', value: 'pictures' },
                { label: 'Other', value: 'other' },
              ]}
              onChange={e => setCategory(e.target.value)}
              theme={theme}
              required
            />

            <Textarea
              name="description"
              label="Description"
              placeholder="Description..."
              className="text-area"
              role="textbox"
              asterik={true}
              rows={6}
              onChange={e => setDescription(e.target.value)}
              required
              theme={theme}
            />
            <Filter
              name="Collection"
              label="Collection"
              asterik={true}
              className="border"
              options={foundCollections}
              defaultValue={
                (foundCollections && foundCollections[0]?.value) || ''
              }
              onChange={e => setCollection(e.target.value)}
              theme={theme}
              required
            />

            <Input
              name="price"
              label="Price in ETH"
              asterik={true}
              placeholder="Price"
              type="number"
              onChange={e => setPrice(parseInt(e.target.value))}
              required
              theme={theme}
            />

            <TagInput
              name="hashtags"
              label="Hashtags"
              placeholder="Add hashtags about your art"
              asterik={true}
              tags={hashtags}
              setTags={setHashtags}
              theme={theme}
            />

            <button type="submit">Create item</button>
            <small className="listing-price">Listing Fee is 0.025 ETH</small>
          </form>
        </div>
      </motion.div>
      <input
        type="file"
        ref={hiddenDpInput}
        onChange={uploadDpHandler}
        style={{ display: 'none' }}
      />
    </StyledCreateNft>
  );
};

const StyledCreateNft = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  padding: 2rem 6rem;
  gap: 2.5rem;
  @media screen and (max-width: 900px) {
    gap: 2rem;
  }
  width: 100%;
  .page_header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
    h2 {
    }
  }
  .page_container {
    padding: 1rem 6rem;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 1rem 0rem;
      gap: 0rem;
    }
    h2 {
      font-size: 1.6rem;
      @media screen and (max-width: 900px) {
        font-size: 1.3rem;
      }
    }
    .upload_div {
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding: 1rem;
      }

      .img_input {
        /* border: 2px solid #7aedc7; */
        border-radius: 0.5rem;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 28rem;
        border: 2.5px dashed #ccc;
        width: 100%;
        box-sizing: border-box;
        border-radius: 5px;
        margin-bottom: 2rem;

        background: ${({ theme_ }) => (theme_ ? '#24242b' : '#f2f2f2')};
        /* box-shadow: 0 0 3px #ccc; */
        h3 {
          font-size: 1.2rem;
        }
        img {
          width: 100%;
          display: block;
          object-fit: cover;
        }
      }
      .box {
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        border-radius: 0.5rem;
        .icon {
          font-size: 10rem;
        }
        .plain-btn {
          margin-top: 1rem;
          padding: 0.5rem 3rem;
        }
      }
    }

    .preview_div {
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      padding-left: 2rem;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding-left: 0rem;
        padding: 1rem;
      }
      .listing-price {
        padding: 2rem 0.5rem;
        color: #d04bff;
      }
    }
  }
`;
export default CreateNft;
