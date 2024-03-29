<script lang="ts">
	import { ethers } from 'ethers';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { env } from '$lib/constants';
	import { user } from '$lib/stores/user';
	import { getImageType, prettyAddress, evaluateNft, Grade } from '$lib/utils/functions';
	import { connectWallet } from '$lib/utils/connect-wallet';
	import { mementoAbi } from '$lib/mementoAbi';

	let errorPreparingMint = false;
	let readyToMint = false;
	let newTokenURI = '';
	let transactionStarted: boolean = false;
	let successfullyMinted: boolean = false;
	let transactionHash: string;
	let newTokenId: string;

	let newMetadata = {};
	let fetchedImageUrl;
	let originalContractAddress = $page.params.address;
	let originalTokenId = $page.params.id;
	let originalTokenUri = '';
	let evaluation;
	let ipfsNode;

	// TODO: This needs to switch with networks
	let network = 'rinkeby';
	// TODO: mainnet address too and switching between them
	let mementoContractAddress = '0x9774e5c56573C2Faa4ce0D976Edf8486868BdB72';

	onMount(async () => {
		if (window && window.ethereum?.selectedAddress) await connectWallet();

		// Early Exit if not on right network
		if ($user.network.nickname !== 'rinkeby') {
			return;
		}

		// https://discuss.ipfs.io/t/js-ipfs-broke-error-unhandled-rejection-lockexistserror-lock-already-being-held-for-file-ipfs-repo-lock/11172/6
		ipfsNode = await Ipfs.create({ repo: 'ok' + Math.random() });

		// If you directly load this page, the wallet isn't connected so it can't get blocknumber
		let blockNumber = 'unknown';
		if ($user.provider) {
			blockNumber = await $user.provider.getBlockNumber();
		}

		const moralisData = await getMoralisData(originalContractAddress, originalTokenId);
		originalTokenUri = moralisData.token_uri;

		// First, get the token metadata (i.e. result of calling tokenURI and fetching)
		const metadata = JSON.parse(moralisData.metadata);
		newMetadata['originalTokenMetadata'] = metadata;
		newMetadata['name'] = `(Memento) ${metadata.name}`;
		newMetadata[
			'description'
		] = `This is a Forever721 Memento™ of NFT ${metadata.name} at block #${blockNumber}`;

		// Then, retrieve the image so you can put it on ipfs
		let image_url = metadata.image;
		const ipfsImageUrl = uploadToIPFS(image_url);

		newMetadata['image_url'] = ipfsImageUrl;
		newMetadata['image'] = getPolaroidVersion(ipfsImageUrl);

		fetchedImageUrl = metadata.image;

		// Now newMetadata is complete, upload it so we can use it as the tokenURI
		newTokenURI = await uploadMetadataStringToIpfs(JSON.stringify(newMetadata));

		evaluation = await evaluateNft(moralisData.token_uri);

		readyToMint = true;
	});

	async function uploadToIPFS(image_url) {
		// returns 'ipfs', 'http', or 'embedded', or 'other'
		const imageType = await getImageType(image_url);
		console.log('image type:', imageType);

		// TODO: eliminate false positives due to http://gateway/ipfs
		// They should be treated as IPFS links and may not need to be re-added to ipfs
		if (imageType == 'http') {
			// Get image data
			const response = await fetch(image_url);

			if (!response.ok) {
				// TODO: Show fail to fetch in UI
				console.log('Issue fetching image: ', response);
				errorPreparingMint = true;
				return;
			}

			try {
				const imageData = await response.blob();
				const result = await ipfsNode.add(imageData);
				console.log('ipfs result', result);

				// overwrite the original image_url with the new ipfs one
				return 'ipfs://' + result.path + '/';
			} catch (error) {
				console.log('Error uploading image to IPFS: ', error);
				errorPreparingMint = true;
				return;
			}
		}
	}

	async function uploadMetadataStringToIpfs(metadata) {
		try {
			const result = await ipfsNode.add(metadata);
			console.log('metadata ipfs result', result);

			// if you get ipfs, overwrite the image_url
			return 'ipfs://' + result.path + '/';
		} catch (error) {
			console.log('Error uploading metadata to IPFS: ', error);
			errorPreparingMint = true;
			return;
		}
	}

	async function getMoralisData(contractAddress, tokenId) {
		let url = `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/${tokenId}?chain=${$user.network.id}&format=decimal`;

		let options: RequestInit = {
			headers: {
				Accept: 'application/json',
				//@ts-ignore
				'X-API-Key': env.moralisApiKey
			}
		};

		let resp;
		let result;
		try {
			resp = await fetch(url, options);
			result = await resp.json();
		} catch (e) {
			console.log('problem in fetch or decode of metadata', e);
			errorPreparingMint = true;
		}
		console.log('getMoralisData: ', result);

		// To do this right, we need to first request moralis re-sync the NFT, since this metadata may be stale.
		// More right would be to query the contract.
		// Logging this to remind us that this is outdated info.
		console.log('this metadata was synced at : ', result.synced_at);

		return result;
	}

	function getPolaroidVersion(image_url) {
		// TODO: magic
		return image_url;
	}

	async function mint() {
		transactionStarted = true;

		let contract = new ethers.Contract(mementoContractAddress, mementoAbi, $user.signer);
		let txn = await contract.snapshot(originalContractAddress, originalTokenId, newTokenURI);
		let result = await txn.wait();

		transactionStarted = false;
		console.log('result:', result);

		// TODO: If not an owner, test failure is try/catch or something else?
		let success = result.events.some((f) => f.event === 'Transfer');
		let tokenId = result.events[0].args[2];
		mementoContractAddress;
		successfullyMinted = true;
		transactionHash = txn.hash;
		newTokenId = tokenId;
		// TODO: Do a better success screen
	}
</script>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="flex items-center mb-8">
			<div class="heading text-5xl flex-grow">Preparing to Mint</div>
		</div>
	</div>
</div>

{#if $user?.network?.nickname !== 'rinkeby'}
	<div class="bg-pink-700 text-white text-2xl py-8">
		<div class="max-w-4xl m-auto px-3 my-8">
			<div class="flex items-center mb-8">
				<div class="heading text-5xl flex-grow">⚠️ WARNING ⚠️</div>
				<div class="heading text-md flex-grow">
					This contract is only deployed to Rinkeby! <br />Check back soon for mainnet.
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="flex flex-row my-16 mx-auto max-w-3xl">
	{#if readyToMint && !successfullyMinted}
		{#if fetchedImageUrl}
			<img class="w-48 h-48" src={fetchedImageUrl} />
		{:else}
			<div class="w-48 h-48 bg-gray-100" />
		{/if}

		<div class="pl-8">
			<p class="heading">Contract Address</p>

			<a
				class="block mb-4 underline"
				href={`https://etherscan.io/address/${originalContractAddress}`}
				>{prettyAddress(originalContractAddress)}</a
			>

			<p class="heading">Token ID</p>
			<p class="mb-4">{originalTokenId}</p>

			<!-- TODO: Abstract into component with nft-thumbnail -->
			<div class="">
				<div class="heading">Our Evaluation</div>
				<div
					class:text-gray-600={!evaluation.grade}
					class:text-green-600={evaluation.grade == Grade.Green}
					class:text-orange-600={evaluation.grade == Grade.Yellow}
					class:text-red-600={evaluation.grade == Grade.Red}
					class="capitalize"
				>
					{evaluation.grade_text}
				</div>
			</div>

			<ul class="mt-2 mb-4">
				<li class="text-sm">{evaluation.uri_type_text}</li>
				<li class="text-sm">{evaluation.image_location_text}</li>
			</ul>

			<div>
				<p class="heading mb-2">Forever721 Memento™ Metadata</p>
				<div class="bg-gray-100 p-2 text-xs mb-4 max-w-xl break-words">
					<p>{JSON.stringify(newMetadata || '')}</p>
				</div>
			</div>

			<div>
				<p class="heading mb-2">Original Metadata</p>

				<div class="bg-gray-100 p-2 text-xs mb-4 max-w-xl break-words">
					<p>{originalTokenUri}</p>
				</div>
			</div>

			<button
				class="w-32 items-center px-4.5 py-2.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
				on:click={() => !transactionStarted && mint()}
			>
				{#if transactionStarted}
					⏳ Minting (check metamask)
				{:else}
					Mint
				{/if}
			</button>
		</div>
	{:else}
		<p class:hidden={$user?.network?.nickname !== 'rinkeby' || successfullyMinted}>
			Analyzing NFT...
		</p>
	{/if}

	{#if successfullyMinted}
		<div>
			Minted successfully! View on <a
				class="lonk"
				href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}
				target="_blank">Etherscan</a
			>
			or
			<a
				class="lonk"
				href={`https://testnets.opensea.io/assets/${mementoContractAddress}/${newTokenId}`}
				target="_blank">OpenSea</a
			>.
		</div>
	{/if}
</div>

<style>
	.lonk {
		@apply text-blue-500 underline;
	}
</style>
