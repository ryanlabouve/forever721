import fetch from 'cross-fetch'
// import { browser } from '$app/env'
const isBrowser=new Function("try {return this===window;}catch(e){ return false;}");
const isNode=new Function("try {return this===global;}catch(e){return false;}");

const ipfsGetEndpoint = "https://ipfs.io/ipfs/"
const base64Regex = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")

export const ImageGrade = {
  Unknown: 0, Green: 1, Yellow: 2, Red: 3
}
export function nftGradeText(_grade) {
  switch(_grade) {
    case ImageGrade.Green: return "Green";
    case ImageGrade.Yellow: return "Yellow";
    case ImageGrade.Red: return "Red";
    default: return "Unknown";
  }
}

export const UriType = {
  Unknown: 0, PrivateServer: 1, IpfsLink: 2, OnChain: 3
}
export function uriTypeText(_type) {
  switch(_type) {
    case UriType.PrivateServer: return "tokenUri contains only link to private server";
    case UriType.IpfsLink: return "tokenUri is IPFS link";
    case UriType.OnChain: return "Metadata stored in tokenUri (on-chain)";
    default: return "Does not match any known tokenUri patterns";
  }
}

export const ImageLocation ={
  Unknown: 0, PrivateServer: 1, Ipfs: 2, Arweave: 3, InMetadata: 4
}
export function imageLocationText(_grade) {
  switch(_grade) {
    case ImageLocation.InMetadata: return "Image is embedded in metadata";
    case ImageLocation.Ipfs: return "Image is hosted on IPFS";
    case ImageLocation.Arweave: return "Image is hosted on Arweave";
    case ImageLocation.PrivateServer: return "Image is hosted on private server";
    default: return "Image does not match known pattern";
  }
}

export function ImageEvaluation(_grade, _location) {
  this.image_grade = _grade;
  this.image_location =_location
}

export function NftEvaluation(_grade, _uri_type, _location, _metadata) {
  this.image_grade = _grade;
  this.uri_type = _uri_type;
  this.image_location =_location;
  this.nft_metadata = _metadata;
}



export function decodeBase64(_in) {
  if (isBrowser()) {
    return atob(cleanBase64(_in));
  }  else {
    return Buffer.from(_in, 'base64').toString();
  }
}

// return structure is a tuple of:
// [<evaluation>, [<reason>, <reason>, ...], { <metadata JSON> }]
export async function evaluateNft(tokenUri) {
  console.log("tokenUri: ", tokenUri);

  if (isBase64(tokenUri)) {
    console.log("it is base64")
    const metadataStr = decodeBase64(cleanBase64(tokenUri))
    console.log(metadataStr)

    try {
      const metadata = JSON.parse(metadataStr)
      console.log("it is json")
      const evaluation = evaluateImage(metadata)
      return new NftEvaluation(evaluation.image_grade, UriType.OnChain, evaluation.image_location, metadata);
    } catch (e) {
      console.log(e)
      console.log("it is not json")
      return new NftEvaluation(ImageGrade.Unknown, UriType.Unknown, ImageLocation.Unknown, null);
    }
  } else {
    console.log("it is url")
    const [url, protocol, hostname] = getResolvableUrl(tokenUri)
    console.log("resolvable url is " + url)
    const metadataStr = await getMetadataFromUrl(url)
    console.log(metadataStr)

    try {
      const metadata = JSON.parse(metadataStr)
      console.log("it is json")

      if (protocol === "ipfs") {
        const evaluation = evaluateImage(metadata)
        return new NftEvaluation(evaluation.image_grade, UriType.IpfsLink, evaluation.image_location, metadata);
      } else {
        return new NftEvaluation(ImageGrade.Red, UriType.PrivateServer, ImageLocation.PrivateServer, metadata);
      }
    } catch (e) {
      console.log("it is not json");
      return new NftEvaluation(ImageGrade.Unknown, UriType.Unknown, ImageLocation.Unknown, null);
    }
  }
}

function evaluateImage(metadata) {

  if (typeof metadata.image === "string" && metadata.image.startsWith("data:image")) {
    return new ImageEvaluation(ImageGrade.Green, ImageLocation.InMetadata);
  }

  const [url, protocol, hostname] = getResolvableUrl(metadata.image)
  if (protocol === "ipfs")
    return new ImageEvaluation(ImageGrade.Green, ImageLocation.Ipfs);

  if (protocol === "http") {
    // TODO this is a proxy for arweave, need to support direct arweave support
    if (hostname === "arweave.net") {
      return new ImageEvaluation(ImageGrade.Green, ImageLocation.Arweave);
    }

    // if not arweave then it's a private server
    return new ImageEvaluation(ImageGrade.Red, ImageLocation.PrivateServer);

  }

  // if we get here then could not classify the image location
  return [ImageGrade.Yellow, ImageLocation.Unknown]
}

export function isBase64(str) {
  if (typeof str !== 'string') return false; // TODO sad note
  return base64Regex.test(cleanBase64(str))
}

function cleanBase64(str) {
  let cleanStr = str
  if (str.includes(";base64,")) {
    cleanStr = str.split(";base64,")[1]
  }
  return cleanStr
}

async function getMetadataFromUrl(url) {
  if (url?.split("://").length !== 2)
    return ""; // TODO: do this better

  const response = await fetch(url)
  return response.text() // can we just .json instead?
}

function getResolvableUrl(uri) {
  let url
  try {
    url = new URL(uri)
  } catch (e) {
    return [null, "none"]
  }
  if (url.protocol === "ipfs:") {
    // ipfs://ipfs/Qm
    const ipfsHash = url.href.replace("ipfs://ipfs/", "").replace("ipfs://", "")
    return [ipfsGetEndpoint + ipfsHash, "ipfs", url.hostname]
  } else if (url.pathname.includes("ipfs") || url.pathname.includes("Qm")) {
    // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
    const ipfsHash = url.pathname.replace("/ipfs/", "")
    return [ipfsGetEndpoint + ipfsHash, "ipfs", url.hostname]
    // TODO need to support arweave here too
  } else {
    return [uri, "http", url.hostname]
  }
}

// returns 'ipfs', 'http', or 'embedded', or 'other'
export async function getTokenUriType(tokenUri) {
  console.log("tokenUri: ", tokenUri);

  if (isBase64(tokenUri)) {
    console.log("it is base64")
    const metadataStr = atob(cleanBase64(tokenUri))
    console.log(metadataStr)

    try {
      const metadata = JSON.parse(metadataStr)
      console.log("it is json")
      return 'embedded';
    } catch (e) {
      console.log(e)
      console.log("base64 tokenUri is not json")
      return 'other';
    }
  } else {
    console.log("it is url")
    const [url, protocol, hostname] = getResolvableUrl(tokenUri)
    console.log("resolvable url is " + url)
    const metadataStr = await getMetadataFromUrl(url)
    console.log(metadataStr)

    try {
      const metadata = JSON.parse(metadataStr)
      console.log("it is json")

      if (protocol === "ipfs") {
        return 'ipfs';
      } else {
        return 'http';
      }
    } catch (e) {
      console.log("it is not json")
      return 'other';
    }
  }
}

// returns 'ipfs', 'http', or 'embedded', or 'other'
export async function getImageType(imageValue) {
  if (typeof imageValue === "string" && imageValue.startsWith("data:image")) {
    return 'embedded';
  } else {
    const [url, protocol, hostname] = getResolvableUrl(imageValue)
    if (protocol === "ipfs") {
      return 'ipfs';
    } else if (protocol === "http") {
      // TODO this is a proxy for arweave, need to support direct arweave support
      if (hostname === "arweave.net") {
        // I'm ignoring arweave for now, treat it as http
        return 'http';
      } else {
        return 'http';
      }
    } else {
      return 'other';
    }
  }
}
