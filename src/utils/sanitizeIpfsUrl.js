const IPFS_GATEWAY = 'https://unreal-client.infura-ipfs.io';
const sanitizeIpfsUrl = url => {
  const gateway = `${IPFS_GATEWAY}/ipfs`;
  if (!url) return url;

  return url
    ?.replace('https://ipfs.io', gateway)
    .replace('https://ipfs.io/ipfs', gateway)
    .replace('https://ipfs.infura.io/ipfs', gateway)
    .replace('ipfs://', gateway);
};

export default sanitizeIpfsUrl;
