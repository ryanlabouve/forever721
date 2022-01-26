const ipfsGetEndpoint = "https://ipfs.io/ipfs/"
const base64Regex = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")

// return structure is a tuple of:
// [<evaluation>, [<reason>, <reason>, ...], { <metadata JSON> }]
export async function evaluateNft(tokenUri) {
  console.log("tokenUri: ", tokenUri);

  if (isBase64(tokenUri)) {
    console.log("it is base64")
    const metadataStr = atob(cleanBase64(tokenUri))
    console.log(metadataStr)

    try {
      const metadata = JSON.parse(metadataStr)
      console.log("it is json")
      const [imageEvaluation, imageMessage] = evaluateImage(metadata)
      return [imageEvaluation, ["Metadata stored in tokenUri (on-chain)", imageMessage], metadata]
    } catch (e) {
      console.log(e)
      console.log("it is not json")
      return ["Unknown", ["Does not match any known tokenUri patterns"], null]
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
        const [imageEvaluation, imageMessage] = evaluateImage(metadata)
        return [imageEvaluation, ["tokenUri is IPFS link", imageMessage], metadata]
      } else {
        return ["Red", ["tokenUri contains only link to private server"], metadata]
      }
    } catch (e) {
      console.log("it is not json")
      return ["Unknown", ["Does not match any known tokenUri patterns"], null]
    }
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

function evaluateImage(metadata) {
  let imageMessage
  let evaluation
  if (typeof metadata.image === "string" && metadata.image.startsWith("data:image")) {
    imageMessage = "Image is embedded in metadata"
    evaluation = "Green"
  } else {
    const [url, protocol, hostname] = getResolvableUrl(metadata.image)
    if (protocol === "ipfs") {
      imageMessage = "Image is hosted on IPFS"
      evaluation = "Green"
    } else if (protocol === "http") {
      // TODO this is a proxy for arweave, need to support direct arweave support
      if (hostname === "arweave.net") {
        imageMessage = "Image is hosted on Arweave"
        evaluation = "Green"
      } else {
        imageMessage = "Image is hosted on private server"
        evaluation = "Red"
      }
    } else {
      imageMessage = "Image does not match known pattern"
      evaluation = "Yellow"
    }
  }
  return [evaluation, imageMessage]
}

export function isBase64(str) {
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
  const response = await fetch(url)
  return response.text()
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
