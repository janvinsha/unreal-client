import React, { useEffect, useState } from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import CoingeckoManager from '../utils/coingecko';
import TokenListManager from '../utils/tokenList';
export default function TokenIconImg(props) {
  let imgURL = props.imgSrc || (props.token && props.token.logoURI);
  // init state
  const [errored, setErrored] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(async () => {
    if (!imgURL) {
      if (props.token && props.token.address) {
        const logoURL = await getLogoURL();
        if (logoURL) {
          setImgSrc(logoURL);
        } else {
          setErrored(true);
        }
      } else {
        setErrored(true);
      }
    } else {
      setImgSrc(imgURL);
    }
  }, [imgURL, props.token?.symbol, props.token?.address]);

  const getLogoURL = async () => {
    var network = TokenListManager.getCurrentNetworkConfig();
    const assetPlatform =
      (network.coingecko && network.coingecko.platform) || '';
    return await CoingeckoManager.getLogoURL(
      assetPlatform,
      props.token.address
    );
  };

  return <img src={imgSrc} />;
}
