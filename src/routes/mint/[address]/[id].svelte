<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { env } from '$lib/constants';
    import { tokenUriToMetaData } from '$lib/nft-utils';
    import { evaluateNft, getTokenUriType, getImageType } from '$lib/utils/functions';
    import defaultAbi from '$lib/defaultAbi';
    import { user } from '$lib/stores/user';
    // import { create } from 'ipfs-http-client'

	let errorPreparingMint = false;
	let readyToMint = false;
	let newTokenURI = '';

	let newMetadata = {};

    import { Contract, ethers } from 'ethers';
	onMount(async () => {
		// Do initialization things here

		// const node1 = await Ipfs.create();
		// const result = await node1.add("hello world2");
		// debugger;


		// If you directly load this page, the wallet isn't connected so it can't get blocknumber 
		let blockNumber = "unknown";
		if ($user.provider) {
        	blockNumber = await $user.provider.getBlockNumber();
		}
        
		// First, get the token metadata (i.e. result of calling tokenURI and fetching)
		const metadata = await getTokenMetadata();
        newMetadata['originalTokenMetadata'] = metadata;
        newMetadata['description'] = `This is a Snapshot of NFT ${metadata.name} at block #${blockNumber}`;

		// Then, retrieve the image so you can put it on ipfs
		let image_url = metadata.image;
		// returns 'ipfs', 'http', or 'embedded', or 'other'
		const imageType = await getImageType(image_url);
		console.log("image type:", imageType);

		const node = await Ipfs.create();

        // TODO: eliminate false positives due to http://gateway/ipfs
        // They should be treated as IPFS links and may not need to be re-added to ipfs
        if (imageType == 'http') {
            // Get image data 
            const response = await fetch(image_url);
            if (!response.ok) {  // TODO: Show fail to fetch in UI 
                console.log('Issue fetching image: ', response);
                errorPreparingMint = true;
                return;
            }
			let result;
            try {
                const imageData = await response.blob();
				result = await node.add(imageData);
				console.log("ipfs result", result);

				// if you get ipfs, overwrite the image_url
				image_url = "ipfs://" + result.path + "/";
            } catch (error) {
                console.log('Error uploading image to IPFS: ', error);
                errorPreparingMint = true;
                return; 
            }
		}

		newMetadata['image_url'] = image_url;
		newMetadata['image'] = getPolaroidVersion(image_url);

		// Now newMetadata is complete, upload it so we can use it as the tokenURI
		try {
			const result = await node.add(JSON.stringify(newMetadata));
			console.log("metadata ipfs result", result);

			// if you get ipfs, overwrite the image_url
			newTokenURI = "ipfs://" + result.path + "/";
		} catch (error) {
			console.log('Error uploading metadata to IPFS: ', error);
			errorPreparingMint = true;
			return; 
		}

		readyToMint = true;
		mint();
    });

	async function mint() {
		// TODO: mint with newTokenURI
	}

	async function getTokenMetadata() {
		// Note(divergio): I could not get this code that reads the contract to work
        // let nftContract: Contract = new ethers.Contract($page.params.address, defaultAbi, $user.provider);
        // let tokenUri = await nftContract.tokenURI($page.params.id);
        // let metadata = await tokenUriToMetaData(tokenUri);

		// Note(divergio): I am also not sure familiar with how to pass the data in from the home page,
		// because this is using a route instead of a component.
		// So I just query moralis again  ¯\_(ツ)_/¯

		// It's frustrating that the centralized solution seems always to be simpler and expedient.

		let url = `https://deep-index.moralis.io/api/v2/nft/${$page.params.address}/${$page.params.id}?chain=eth&format=decimal`

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
			console.log("problem in fetch or decode of metadata", e);
			errorPreparingMint = true;
		}
		console.log ("mint page got metadata: ", result.metadata);

		// To do this right, we need to first request moralis re-sync the NFT, since this metadata may be stale.
		// More right would be to query the contract. 
		// Logging this to remind us that this is outdated info. 
		console.log("this metadata was synced at : ", result.synced_at);

		return JSON.parse(result.metadata);
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

<div>
	address: {$page.params.address}
</div>
<div>
	id: {$page.params.id}
</div>

<div>
	error preparing mint: {errorPreparingMint}
</div>

<div>
	newMetadata: {JSON.stringify(newMetadata)}
</div>

<div>
	newTokenURI: {JSON.stringify(newTokenURI)}
</div>

<!-- TODO: this should be a button with a callback that gets enabled when this bool is true -->
<div> 
	readyToMint: {readyToMint}
</div>
