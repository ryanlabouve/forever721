<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { tokenUriToMetaData } from '$lib/nft-utils';
	import { evaluateNft, getTokenUriType, getImageType } from '$lib/utils/functions';
	import defaultAbi from '$lib/defaultAbi';
	import { user } from '$lib/stores/user';
	import { create } from 'ipfs-http-client'

	import { Contract, ethers } from 'ethers';

	var errorPreparingMint = false;

	onMount(async () => {
		// First, get tokenURI of the NFT
		let nftContract: Contract = new ethers.Contract($page.params.address, defaultAbi, $user.provider);
		let tokenUri = await nftContract.tokenURI($page.params.id);
		let metadata = await tokenUriToMetaData(tokenUri);
		let blockNumber = $user.provider.getBlockNumber();
		
		// returns 'ipfs', 'http', or 'embedded', or 'other'
		const imageType = await getImageType(metadata.image);

		const client = create('https://ipfs.infura.io:5001/api/v0');

		// TODO: try to fetch the actual name from the contract
		const nftName = $page.params.address; 

		const newMetadata = {};
		newMetadata['originalTokenMetadata'] = metadata;
		newMetadata['description'] = `This is a Snapshot of NFT ${nftName} #${$page.params.id} at block #${blockNumber}`;
		
		// TODO: eliminate false positives due to http://gateway/ipfs
		// They should be treated as IPFS links
		if (imageType == 'http') {
			// Get image data 
			const response = await fetch(metadata['image']);
			if (!response.ok) {	 // TODO: Show fail to fetch in UI 
				console.log('Issue fetching image: ', response);
				errorPreparingMint = true;
				return;
			}
			let results;
			try {
				const imageData = await response.blob();
				results = await client.add(imageData);
			} catch (error) {
				console.log('Error uploading to IPFS: ', error);
				errorPreparingMint = true;
				return; 
			}

			// const cid = results[0].hash
			// const ipfsLink = `ipfs://ipfs/` + cid;
			console.log(results);

			console.log("done");

			// TODO: insert ipfs here 
			// newMetadata['image'] = ""

			// TODO: Upload newMetadata to IPFS and return hash

			// TODO: show minting button, ready to mint using hash from previous state
		}

		// TODO: add attribute "isSnapshot: true" to the metadata of every snapshotted NFT
	});

</script>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="flex items-center mb-8">
			<div class="heading text-5xl flex-grow">Preparing to Mint</div>

		</div>
	</div>
</div>

<div>
	address: {$page.params.address}
</div>
<div>
	id: {$page.params.id}
</div>
<div>
	issue minting?: {errorPreparingMint}
</div>
