<script lang="ts">
	import defaultAbi from '$lib/defaultAbi';
	import { user } from '$lib/stores/user';

	import { Contract, ethers } from 'ethers';
	import { onMount } from 'svelte';

	let imageLoaded: boolean = false;
	let tokenId: string;
	let nftContractAddress: string;

	onMount(() => {
		// TODO: Just for debugging. Delete before prod;
		nftContractAddress = '0x25ed58c027921e14d86380ea2646e3a1b5c55a8b';
		tokenId = '7694';
	});

	// Reads metadata from contract
	async function checkNft(nftContractAddress: string, tokenId: string): Promise<void> {
		let nftContract: Contract = new ethers.Contract(nftContractAddress, defaultAbi, $user.provider);
		let metaData = await nftContract.tokenURI(tokenId);
		debugger;
	}
</script>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="heading text-5xl">Scan an NFT</div>
		<div class="grid grid-cols-2 gap-4">
			<!-- Placeholder -->
			<div class="my-4">
				<div class="border border-gray-500 rounded-lg  py-32">
					{#if imageLoaded}
						image
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
					<div>NFT Contract Address</div>
					<div>
						<input bind:value={nftContractAddress} />
					</div>
				</div>
				<div class="mb-4">
					<div>Token ID</div>
					<div>
						<input bind:value={tokenId} />
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
		@apply text-gray-600;
	}

	input[type='submit'] {
		@apply text-white;
	}
</style>
