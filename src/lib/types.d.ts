/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export interface UserStore {
	walletAddress: string;
	walletENSAddress: string;
	provider: ethers.providers.Web3Provider;
	signer: ethers.providers.JsonRpcSigner;
	network: Network;
}

export interface Network {
	name: string;
	nickname: string;
	color: string;
	id: string;
}