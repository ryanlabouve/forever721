const tokenUriToMetaData = (metaData: string) => {
  const base64Parts: string[] = metaData.split('base64,');
  const isBase64String: boolean = base64Parts.length > 1;

  if (isBase64String) {
    return JSON.parse(atob(base64Parts[1]));
  }

  return JSON.parse(metaData);
};

export { tokenUriToMetaData }