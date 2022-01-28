<script lang="ts">
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import { env } from '$lib/constants';
	import { user } from '$lib/stores/user';
	import dummyNftCollection from '$lib/dummyNftCollection';
	import NftThumbnail from '$lib/nft-thumbnail.svelte';
	import defaultAbi from '$lib/defaultAbi';
	import { getURLFromURI } from '$lib/utils/functions';

	import Button from '$lib/ui/button.svelte';
	import ScanAnNft from '$lib/sections/scan-an-nft.svelte';
	import LearnMore from '$lib/sections/learn-more.svelte';
	import { connectWallet } from '$lib/utils/connect-wallet';

	let contractAddress: string = '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0';
	let contractABI: string = '';
	let collection = [];

	// TODO: This needs to switch with networks
	let network = 'rinkeby';

	onMount(async () => {
		if (window && window.ethereum?.selectedAddress) connectWallet();
	});

	async function getABI() {
		let etherscanURL = `http://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${env.etherscanKey}`;
		try {
			let response = await fetch(etherscanURL);

			if (!response.ok) {
				throw 'Error calling etherscan';
			}

			let json = await response.json();
			contractABI = json.result;
		} catch (e) {
			console.error(e);
		}
	}

	async function loadCollection() {
		// Example wallet with decent # of NFTs
		// let url = `https://deep-index.moralis.io/api/v2/0x4e320fd00807f015f3c58d0d49edda2db78963fc/nft?chain=eth&format=decimal`;
		let url = `https://deep-index.moralis.io/api/v2/${$user.walletAddress}/nft?chain=${network}&format=decimal`;

		let options: RequestInit = {
			headers: {
				Accept: 'application/json',
				//@ts-ignore
				'X-API-Key': env.moralisApiKey
			}
		};
		let resp = await fetch(url, options);
		let { result } = await resp.json();

		collection = result.reduce((acc, item) => {
			if (!item.metadata) return acc;

			let { metadata } = item;
			metadata = JSON.parse(metadata);

			return [
				...acc,
				{
					metadata: JSON.parse(item.metadata),
					image_url: getURLFromURI(metadata.image),
					description: metadata.name,
					created_date: item.block_number,
					token_id: item.token_id,
					token_uri: item.token_uri,
					token_address: item.token_address
				}
			];
		}, []);
	}

	async function readNFT() {
		let randoNFT = dummyNftCollection[0];
		let saddness = new ethers.Contract(
			randoNFT.primary_asset_contracts[0].address,
			defaultAbi,
			$user.provider
		);

		let a = await saddness.tokenURI(5);
		debugger;
	}

	async function tryDopp() {
		// Params:
		let walletAddress = $user.walletAddress;
		let dopContractAddress = '0x823CFCe3571e2f3E7897e5E6B1082170bfbFED2d';
		// Contract address
		let contractAddress = '0x6eee7ca9d7c541081ac35f8d995698f9a51ec89e';
		let tokenId = '1';

		// Doing:
		// Load ABI
		// Call dopp contract with params
		let dopAbi;
		let saddness = new ethers.Contract(dopContractAddress, dopAbi, $user.signer);
		let resultOfSadness = await saddness.snapshot(contractAddress, tokenId);
		let resultOfWaitingOnSadness = await resultOfSadness.wait();

		// let waitingOnSaddnessWorked = resultOfWaitingOnSadness.events.include(
		// 	(f) => f.event === 'SnapshotCreated'
		// );

		// resultOfWaitingOnSadness.to
		// resultOfWaitingOnSadness.transactionHash
		// new token id? resultOfWaitingOnSadness.events[0].args[2] ==> 0x02
		// new token id? resultOfWaitingOnSadness.events[0].tokenId ==> 0x02
		// new token id? resultOfWaitingOnSadness.events[1].args[1] ==> 0x02

		debugger;
		// Show a success by reacitng to Emit
	}
</script>

<svelte:head>
	<title>Forever721</title>
</svelte:head>

{#if collection.length == 0}
	<div class="max-w-4xl m-auto px-3 my-16">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col justify-center">
				<div class="text-3xl heading">What's in your NFT? Let's find out.</div>
				<div class="mb-4">
					When you buy NFTs you are buying the metadata. Learn what's in it and what you can do to
					improve it.
				</div>
				<div>
					<div class="flex   items-center ">
						<div class="mr-2">
							<Button disabled={!$user.walletAddress} onClick={loadCollection}
								>🖼 Load your collection 🖼</Button
							>
						</div>
						{#if !$user.walletAddress}
							<div class="text-xs underline cursor-pointer" on:click={connectWallet}>
								Connect Wallet first 🦊!
							</div>
						{/if}
					</div>
				</div>
			</div>
			<!-- transform: perspective(1500px) rotateY(-35deg) translateX(21px) scale(1.03) -->
			<div style="">
				<img src="/images/badhero.png" alt=" Bad hero" />
			</div>
		</div>
	</div>
{:else}
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="text-xl my-4">Here's what we found when scanning your collection...</div>
		<div class="grid grid-cols-3 gap-4">
			{#each collection as nft}
				<NftThumbnail {...nft} />
			{:else}
				No NFTs found!
			{/each}
		</div>
	</div>
{/if}

<ScanAnNft />

<LearnMore />

<div class="bg-pink-300 py-8">
	<div class="max-w-3xl m-auto px-3 ">
		<div class="text-2xl text-white">DEBUG</div>
		<Button onClick={connectWallet}>Connect Wallet and get tokenuri</Button>
		<Button onClick={() => loadCollection()}>Load Collection</Button>
		<Button onClick={() => readNFT()}>Read metadata from NFT</Button>
		<Button onClick={() => tryDopp()}>Try to make a doppleganger</Button>
	</div>
</div>

<div class="py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<footer class="bg-white">
			<div class="mb-4 ">
				<p class="text-center text-base text-gray-400">
					&copy; 2022. No rights reserved. Go protect your NFTs
				</p>
			</div>
			<div class="flex justify-center space-x-6 ">
				<a href="#" class="text-gray-400 hover:text-gray-500">
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
		</footer>
	</div>
</div>
