import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { user } from "$lib/stores/user";

async function connectWallet(): Promise<void> {
  const providerOptions = {
    /* See Provider Options Section */
  };

  const web3Modal = new Web3Modal({
    // network: 'mainnet', // optional
    // network: 'rinkeby', // optional
    cacheProvider: true, // optional
    providerOptions // required
  });

  const instance = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  const walletENSAddress = await provider.lookupAddress(walletAddress);

  // todo: move this out of connect wallet
  user.update(() => {
    return {
      walletAddress,
      walletENSAddress,
      provider,
      signer
    };
  });
}

export { connectWallet }