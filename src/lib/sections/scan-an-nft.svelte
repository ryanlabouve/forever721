<script lang="ts">
	import defaultAbi from '$lib/defaultAbi';
	import { user } from '$lib/stores/user';
	import Nft from '$lib/ui/nft.svelte';
	import { tokenUriToMetaData } from '$lib/nft-utils';

	import { Contract, ethers } from 'ethers';
	import { onMount } from 'svelte';

	let metaData;
	let imageLoaded: boolean = false;
	let tokenId: string;
	let nftContractAddress: string;
	let openseaUrl: string;

	onMount(() => {
		// TODO: Just for debugging. Delete before prod;
		// On Chain

		// nftContractAddress = '0x25ed58c027921e14d86380ea2646e3a1b5c55a8b';
		// tokenId = '7694';

		// IPFS
		//opensea.io/assets/0x3db5463a9e2d04334192c6f2dd4b72def4751a61/487
		// nftContractAddress = '0x3db5463a9e2d04334192c6f2dd4b72def4751a61';
		// tokenId = '487';

		// Plain HTTPS
		openseaUrl = 'https://opensea.io/assets/0xed5af388653567af2f388e6224dc7c4b3241c544/1948';
		nftContractAddress = '0xed5af388653567af2f388e6224dc7c4b3241c544';
		tokenId = '1948';
	});

	function setOpenseaUrl(e) {
		let url = e.clipboardData.getData('text');
		// https://opensea.io/assets/:nftContractAddress/:tokenId
		let openseaAddresAndIdRe = /https:\/\/opensea.io\/assets\/(\w*)\/(\w*)/g;
		let [_, address, id] = openseaAddresAndIdRe.exec(url);

		if (address && id) {
			openseaUrl = url;
			nftContractAddress = address;
			tokenId = id;
		}
	}

	function setNftContractAddress(e) {
		let id = e.target.value;
		openseaUrl = `https://opensea.io/assets/${address}/${tokenId}`;
		nftContractAddress = address;
	}

	function setTokenId(e) {
		let id = e.target.value;
		openseaUrl = `https://opensea.io/assets/${nftContractAddress}/${id}`;
		tokenId = id;
	}

	// Reads metadata from contract
	async function checkNft(nftContractAddress: string, tokenId: string): Promise<void> {
		let nftContract: Contract = new ethers.Contract(nftContractAddress, defaultAbi, $user.provider);
		let tokenUri = await nftContract.tokenURI(tokenId);
		metaData = await tokenUriToMetaData(tokenUri);
		imageLoaded = true;
	}
</script>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="flex items-center mb-8">
			<div class="heading text-5xl flex-grow">Scan an NFT</div>

			<div>Audit a single NFT by address</div>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<!-- Placeholder -->
			<div class="my-4">
				<div class="border border-gray-500 rounded-lg  py-32">
					{#if imageLoaded}
						<Nft {metaData} />
					{:else}
						<div
							class="flex items-center align-middle justify-center stroke-current storke-gray-500 fill-gray-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-16 w-16"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
					{/if}
				</div>
			</div>
			<!-- Form -->
			<form on:submit|preventDefault={() => checkNft(nftContractAddress, tokenId)}>
				<div>
					<div>Opensea URL</div>
					<div class="flex ">
						<input
							class="rounded-tr-none rounded-br-none"
							style="border-bottom-right-radius: 0px; border-top-right-radius: 0px;"
							value={openseaUrl}
							on:paste={(e) => setOpenseaUrl(e)}
						/>
						<a
							href={openseaUrl}
							target="_blank"
							class="bg-gray-500 px-3 text-xs flex items-center rounded-tr-md rounded-br-md"
							>Visit&nbsp;→</a
						>
					</div>
				</div>
				<div class="relative my-8">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-300" />
					</div>
					<div class="relative flex justify-center">
						<span class="px-2 bg-white text-sm text-gray-500"> Or </span>
					</div>
				</div>
				<div>
					<div>NFT Contract Address</div>
					<div>
						<input value={nftContractAddress} on:change={(e) => setNftContractAddress(e)} />
					</div>
				</div>
				<div class="mb-4">
					<div>Token ID</div>
					<div>
						<input value={tokenId} on:change={(e) => setTokenId(e)} />
					</div>
				</div>
				<div>
					<input class="border border-white p-2" type="submit" value="Analyze NFT" />
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	input {
		@apply text-gray-600 border border-gray-400 bg-gray-800 text-gray-300 px-2 py-3 w-full rounded focus:border-gray-100
		focus:text-gray-50 focus:ring-gray-50;
	}

	input[type='submit'] {
		@apply text-white rounded-full cursor-pointer;
	}
</style>
