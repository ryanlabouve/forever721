<script lang="ts">
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import { connectWallet, disconnectWallet } from '$lib/utils/connect-wallet';
	import { prettyAddress } from '$lib/utils/functions';

	let showDisconnect = false;
</script>

<header class="flex px-3 py-8  items-center">
	<div class="flex-grow font-bold heading">Forever721</div>

	{#if $user.walletAddress}
		<div class="relative cursor-pointer" on:mouseenter={() => (showDisconnect = true)}>
			<div class="px-2 lonk pretty-lonk">
				Connected as {$user.walletENSAddress || prettyAddress($user.walletAddress)}
			</div>
			{#if showDisconnect}
				<div
					class="px-2 py-1.5 shadow-lg absolute top-full"
					on:mouseleave={() => (showDisconnect = false)}
					on:click={() => disconnectWallet()}
				>
					Disconnect
				</div>
			{/if}
		</div>
	{:else}
		<button on:click={() => connectWallet()} class="px-2 lonk underline cursor-auto"
			>Connect Wallet</button
		>
	{/if}
	<a href="#scan-an-nft" class="px-2 lonk">Scan an NFT</a>
	<a href="#learn-more" class="px-2 lonk">Learn More</a>
	<div>
		<a href="#">
			<img class="w-6 h-6" src="/images/github.svg" />
		</a>
	</div>
</header>

<style>
	.lonk {
		@apply text-xs;
	}

	.pretty-lonk {
		@apply text-pink-600;
	}
</style>
