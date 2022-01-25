const tokenUriToMetaData = async (metaData: string) => {
  const base64Parts: string[] = metaData.split('base64,');
  const isBase64String: boolean = base64Parts.length > 1;
  const isIPFS: boolean = metaData.indexOf('ipfs://') > -1;
  const isHttps: boolean = metaData.indexOf('https://') > -1;

  if (isBase64String) {
    return JSON.parse(atob(base64Parts[1]));
  }

  if (isIPFS) {
    const data = await getDataFromIPFS(metaData);
    return data;
  }

  if (isHttps) {
    const data = await getDataFromHttps(metaData);
    return data;
  }

  return JSON.parse(metaData);
};

const getDataFromIPFS = async (ipfsUrl: string) => {
  return await getDataFromHttps(swapIpfsProtocolToHttp(ipfsUrl));
}

const getDataFromHttps = async (url: string) => {
  const res = await fetch(url);
  let json = await res.json();

  if (json.image.indexOf('ipfs://') > -1) {
    json = {
      ...json,
      image: swapIpfsProtocolToHttp(json.image)
    }
  }

  return json;
}

const swapIpfsProtocolToHttp = (ipfsUrl: string) => {
  return `https://ipfs.io/ipfs/${ipfsUrl.slice("ipfs://".length)}`
}

export { tokenUriToMetaData }