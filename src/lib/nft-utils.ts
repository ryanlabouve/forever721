import * as IPFS from 'ipfs-core';

const tokenUriToMetaData = (metaData: string) => {
  const base64Parts: string[] = metaData.split('base64,');
  const isBase64String: boolean = base64Parts.length > 1;
  const isIPFS: boolean = metaData.indexOf('ipfs://') > -1;

  if (isBase64String) {
    return JSON.parse(atob(base64Parts[1]));
  }

  if (isIPFS) {
    return getDataFromIPFS(metaData);
  }

  return JSON.parse(metaData);
};

const getDataFromIPFS = async (ipfsUrl: string) => {
  const node = await IPFS.create()

  const stream = node.cat(ipfsUrl);
  let data = ''

  for await (const chunk of stream) {
    // chunks of data are returned as a Buffer, convert it back to a string
    data += chunk.toString()
  }

  console.log(data)
  return data;
}

export { tokenUriToMetaData }