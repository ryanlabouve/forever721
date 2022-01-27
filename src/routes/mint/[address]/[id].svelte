<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { env } from '$lib/constants';
	import { user } from '$lib/stores/user';
	import { getImageType, getURLFromURI, prettyAddress, evaluateNft } from '$lib/utils/functions';
	import { connectWallet } from '$lib/utils/connect-wallet';

	let errorPreparingMint = false;
	let readyToMint = false;
	let newTokenURI = '';

	let newMetadata = {};
	let fetchedImageUrl;
	let originalContractAddress = $page.params.address;
	let originalTokenId = $page.params.id;
	let originalTokenUri = '';
	let grade = '';
	let evaluations = [];

	onMount(async () => {
		if (window && window.ethereum?.selectedAddress) connectWallet();

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
		newMetadata[
			'description'
		] = `This is a Snapshot of NFT ${metadata.name} at block #${blockNumber}`;

		// Then, retrieve the image so you can put it on ipfs
		let image_url = metadata.image;
		// returns 'ipfs', 'http', or 'embedded', or 'other'
		const imageType = await getImageType(image_url);
		console.log('image type:', imageType);

		// https://discuss.ipfs.io/t/js-ipfs-broke-error-unhandled-rejection-lockexistserror-lock-already-being-held-for-file-ipfs-repo-lock/11172/6
		const node = await Ipfs.create({ repo: 'ok' + Math.random() });

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
			let result;
			try {
				const imageData = await response.blob();
				result = await node.add(imageData);
				console.log('ipfs result', result);

				// overwrite the original image_url with the new ipfs one
				image_url = 'ipfs://' + result.path + '/';
			} catch (error) {
				console.log('Error uploading image to IPFS: ', error);
				errorPreparingMint = true;
				return;
			}
		}

		newMetadata['image_url'] = image_url;
		newMetadata['image'] = getPolaroidVersion(image_url);

		console.log('newMetaData imageurl: ', image_url);
		fetchedImageUrl = getURLFromURI(image_url);

		console.log('fetchedImageUrl: ', fetchedImageUrl);

		// Now newMetadata is complete, upload it so we can use it as the tokenURI
		try {
			const result = await node.add(JSON.stringify(newMetadata));
			console.log('metadata ipfs result', result);

			// if you get ipfs, overwrite the image_url
			newTokenURI = 'ipfs://' + result.path + '/';
		} catch (error) {
			console.log('Error uploading metadata to IPFS: ', error);
			errorPreparingMint = true;
			return;
		}

		let nftEvaluation = await evaluateNft(moralisData.token_uri);
		console.log('nftEvaluation', nftEvaluation);
		grade = nftEvaluation[0];
		evaluations = nftEvaluation[1];

		console.log('blah:', evaluations);

		readyToMint = true;
	});

	async function mint() {
		// TODO: mint with newTokenURI
	}

	async function getMoralisData(contractAddress, tokenId) {
		let url = `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/${tokenId}?chain=eth&format=decimal`;

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
</script>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="flex items-center mb-8">
			<div class="heading text-5xl flex-grow">Preparing to Mint</div>
		</div>
	</div>
</div>

<div class="flex flex-row mt-16 mx-auto max-w-lg">
	<div>
		{#if fetchedImageUrl}
			<img class="w-32 h-32" src={fetchedImageUrl} />
		{:else}
			<div class="w-32 h-32 bg-gray-100" />
		{/if}
	</div>

	<div class="pl-8">
		<p class="heading">Contract Address</p>

		<a class="block mb-4 underline" href={`https://etherscan.io/address/${originalContractAddress}`}
			>{prettyAddress(originalContractAddress)}</a
		>

		<p class="heading">Token ID</p>
		<p class="mb-4">{originalTokenId}</p>

		<!-- TODO: Abstract into component with nft-thumbnail -->
		<div class="">
			<div class="heading">Our Evaluation</div>
			<div
				class:text-gray-600={!grade}
				class:text-green-600={grade == 'Green'}
				class:text-orange-600={grade == 'Yellow'}
				class:text-red-600={grade == 'Red'}
				class="capitalize"
			>
				{grade}
			</div>
		</div>

		<ul class="my-4">
			{#each evaluations as evaluation}
				<li class="text-sm">{evaluation}</li>
			{/each}
		</ul>

		<div>
			<p class="heading mb-2">Forever721™ Memento Metadata</p>
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
	</div>
</div>
