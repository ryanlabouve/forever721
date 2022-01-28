import fetch from 'cross-fetch'
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
const isNode = new Function("try {return this===global;}catch(e){return false;}");

const ipfsGetEndpoint = "https://ipfs.io/ipfs/"
const base64Regex = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")

export enum Grade {
  Red = 0,
  Unknown,
  Yellow,
  Green
}

export function nftGradeText(grade: Grade): string {
  switch (grade) {
    case Grade.Green: return "Great";
    case Grade.Yellow: return "Caution";
    case Grade.Red: return "Warning";
    default: return "Unknown";
  }
}

export enum UriType {
  Unknown = 0,
  PrivateServer,
  IpfsLink,
  OnChain,
  ArweaveLink
}

export function uriTypeText(type: UriType): string {
  switch (type) {
    case UriType.PrivateServer: return "TokenUri contains only link to private server";
    case UriType.IpfsLink: return "TokenUri is IPFS link";
    case UriType.ArweaveLink: return "TokenUri is Arweave link";
    case UriType.OnChain: return "Metadata stored in TokenUri (on-chain)";
    default: return "Does not match any known tokenUri patterns";
  }
}

export enum ImageLocation {
  Unknown = 0,
  PrivateServer,
  Ipfs,
  Arweave,
  InMetadata
}

export function imageLocationText(location: ImageLocation): string {
  switch (location) {
    case ImageLocation.InMetadata: return "Image is embedded in metadata";
    case ImageLocation.Ipfs: return "Image is hosted on IPFS";
    case ImageLocation.Arweave: return "Image is hosted on Arweave";
    case ImageLocation.PrivateServer: return "Image is hosted on private server";
    default: return "Image does not match known pattern";
  }
}

export function ImageEvaluation(grade: Grade, location: ImageLocation): void {
  this.image_grade = grade;
  this.image_location = location
}

export function NftEvaluation(grade: Grade, image_grade: Grade, uri_type: UriType, location: ImageLocation, metadata: any): void {
  this.grade = grade;
  this.image_grade = image_grade;
  this.uri_type = uri_type;
  this.image_location = location;
  this.nft_metadata = metadata;

  // add texts for convenience
  this.grade_text = nftGradeText(grade);
  this.image_grade_text = nftGradeText(image_grade);
  this.uri_type_text = uriTypeText(uri_type);
  this.image_location_text = imageLocationText(location);
}

export function decodeBase64(input: string): string {
  if (isBrowser()) {
    return atob(cleanBase64(input));
  } else {
    return Buffer.from(cleanBase64(input), 'base64').toString();
  }
}

export async function evaluateNft(tokenUri) {
  if (isBase64(tokenUri)) {
    const metadataStr = decodeBase64(cleanBase64(tokenUri))

    try {
      const metadata = JSON.parse(metadataStr)
      const evaluation = evaluateImage(metadata)

      // if metadata on-chain, overall grade is whatever the image grade is
      return new NftEvaluation(evaluation.image_grade, evaluation.image_grade, UriType.OnChain, evaluation.image_location, metadata);
    } catch (e) {
      return new NftEvaluation(Grade.Unknown, Grade.Unknown, UriType.OnChain, ImageLocation.Unknown, null);
    }
  } else {
    const [url, uriType, urlObj] = getResolvableUrl(tokenUri)
    const metadataStr = await getMetadataFromUrl(url)
    const uriGrade = gradeUriType(uriType);

    try {
      const metadata = JSON.parse(metadataStr)
      const evaluation = evaluateImage(metadata)
      return new NftEvaluation(Math.min(uriGrade, evaluation.image_grade), evaluation.image_grade, uriType, evaluation.image_location, metadata);
    } catch (e) {
      return new NftEvaluation(uriGrade, Grade.Unknown, uriType, ImageLocation.Unknown, null);
    }
  }
}

function gradeUriType(uriType) {
  switch (uriType) {
    case UriType.IpfsLink:
    case UriType.ArweaveLink:
    case UriType.OnChain:
      return Grade.Green;
    default:
      return Grade.Red;
  }
}

function evaluateImage(metadata) {
  if (typeof metadata.image === "string" && metadata.image.startsWith("data:image"))
    return new ImageEvaluation(Grade.Green, ImageLocation.InMetadata);

  const [url, uriType, urlObj] = getResolvableUrl(metadata.image)
  if (uriType === UriType.IpfsLink)
    return new ImageEvaluation(Grade.Green, ImageLocation.Ipfs);

  if (uriType === UriType.ArweaveLink)
    return new ImageEvaluation(Grade.Green, ImageLocation.Arweave);

  if (uriType === UriType.PrivateServer)
    return new ImageEvaluation(Grade.Red, ImageLocation.PrivateServer);

  // if we get here then could not classify the image location
  return new ImageEvaluation(Grade.Yellow, ImageLocation.Unknown);
}

export function isBase64(str): boolean {
  if (typeof str !== 'string') return false; // TODO sad note
  return base64Regex.test(cleanBase64(str))
}

function cleanBase64(str): string {
  let cleanStr = str
  if (str.includes(";base64,")) {
    cleanStr = str.split(";base64,")[1]
  }
  return cleanStr
}

async function getMetadataFromUrl(url): Promise<string> {
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
    return [null, "none", null]
  }
  if (url.protocol === "ipfs:") {
    // ipfs://ipfs/Qm
    const ipfsHash = url.href.replace("ipfs://ipfs/", "").replace("ipfs://", "")
    return [ipfsGetEndpoint + ipfsHash, UriType.IpfsLink, url]
  } else if (url.pathname.includes("ipfs") || url.pathname.includes("Qm")) {
    // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
    const ipfsHash = url.pathname.replace("/ipfs/", "")
    return [ipfsGetEndpoint + ipfsHash, UriType.IpfsLink, url]
  } else if (url.hostname === "arweave.net") {
    return [uri, UriType.ArweaveLink, url]
  } else {
    return [uri, UriType.PrivateServer, url]
  }
}

// returns 'ipfs', 'http', or 'embedded', or 'other'
export async function getTokenUriType(tokenUri: string): Promise<string> {
  if (isBase64(tokenUri)) {
    const metadataStr = atob(cleanBase64(tokenUri))

    try {
      /*const metadata = */JSON.parse(metadataStr)
      return 'embedded';
    } catch (e) {
      console.error(e)
      return 'other';
    }
  } else {
    console.log("it is url")
    const [url, uriType/*, urlObj*/] = getResolvableUrl(tokenUri)
    const metadataStr = await getMetadataFromUrl(url)
    try {
      JSON.parse(metadataStr)

      if (uriType === UriType.IpfsLink || uriType === UriType.ArweaveLink) {
        return 'ipfs';
      } else {
        return 'http';
      }
    } catch (e) {
      console.error("it is not json")
      return 'other';
    }
  }
}

// returns 'ipfs', 'http', or 'embedded', or 'other'
export async function getImageType(imageValue): Promise<string> {
  if (typeof imageValue === "string" && imageValue.startsWith("data:image")) {
    return 'embedded';
  } else {
    const [url, uriType, urlObj] = getResolvableUrl(imageValue)
    if (uriType === UriType.IpfsLink) {
      return 'ipfs';
    } else if (uriType === UriType.PrivateServer || uriType === UriType.ArweaveLink) {
      // I'm ignoring arweave for now, treat it as http
      return 'http';
    } else {
      return 'other';
    }
  }
}

export function getURLFromURI(uri) {
  // this code is adapted from CheckMyNFT
  const ipfsGateway = 'https://ipfs.moralis.io:2053/ipfs/';

  if (!uri) {
    throw 'no uri';
  }
  // if correct URI we get the protocol
  let url = new URL(uri);
  // if protocol other IPFS -- get the ipfs hash

  if (url.protocol === 'data:') {
    return url;
  }

  if (url.protocol === 'ipfs:') {
    let ipfsHash;
    // ipfs://ipfs/Qm
    if (url.href.includes('ipfs://ipfs/')) {
      ipfsHash = url.href.replace('ipfs://ipfs/', '');
    } else {
      // ipfs://<ipfs hash>
      ipfsHash = url.href.replace('ipfs://', '');
    }
    return ipfsGateway + ipfsHash;
  }

  if (url.pathname.includes('ipfs')) {
    // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
    let ipfsHash = url.pathname.replace('/ipfs/', '');
    return ipfsGateway + ipfsHash;
  }

  // otherwise it's a centralized uri
  return uri;
}

export function prettyAddress(address: string): string {
  return `${address.slice(0, 2)}...${address.slice(-4)}`
}