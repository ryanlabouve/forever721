<script type="ts">
	import { user } from '$lib/stores/user';
	import { connectWallet, disconnectWallet } from '$lib/utils/connect-wallet';
	import { prettyAddress } from '$lib/utils/functions';

	let showMenu = false;

	function changeNetwork() {
		alert('Beep boop beep boop');
	}

	function switchToDarkMode() {
		alert('Welcome to dark mode!');
	}

	async function disconnect() {
		await disconnectWallet();
	}
</script>

{#if $user.walletAddress}
	<div class="relative cursor-pointer" on:mouseenter={() => (showMenu = true)}>
		<div class="px-2 lonk flex justify-center align-middle">
			<div
				style="background-color: {$user.network.color};"
				class=" w-3 h-3 rounded-full mr-2 mt-0.5"
			/>
			{$user.walletENSAddress || prettyAddress($user.walletAddress)}
			<img src="/images/chevron-down.svg" class="w-3 h-3 ml-1 mt-0.5" />
		</div>
		{#if showMenu}
			<div class="absolute top-full text-xs">
				<div
					class=" shadow-lg  w-56 rounded-lg translate-x-1 bg-white"
					on:mouseleave={() => (showMenu = false)}
					on:click={() => disconnectWallet()}
				>
					<div class="px-3 py-5">
						<div class="flex items-center">
							<div
								style="background-color: {$user.network.color}"
								class=" w-4 h-4 rounded-full mr-2 mt-0.5"
							/>
							<div>
								<div class="text-xl">
									{$user.walletENSAddress ||
										`${$user.walletAddress.slice(0, 2)}...${$user.walletAddress.slice(-4)}`}
								</div>
								<div class="" style="color: {$user.network.color}">
									Connected to {$user.network.name}
								</div>
							</div>
						</div>
					</div>
					<div class="border-b border-zinc-100 " />
					<div class="">
						<button on:click={changeNetwork} class="row">
							<img src="/images/globe.svg" class="i" />Change Network
						</button>
						<button on:click={switchToDarkMode} class="row">
							<img src="/images/moon.svg" class="i" />Switch to Dark Mode
						</button>
						<button on:click={disconnect} class="row">
							<img src="/images/disconnect.svg" class="i" />Disconnect
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<button on:click={() => connectWallet()} class="px-2 lonk underline cursor-auto"
		>Connect Wallet</button
	>
{/if}

<style>
	.row {
		@apply px-3 py-3 hover:bg-gray-100 flex cursor-default items-center opacity-50 cursor-pointer w-full;
	}

	.row:hover {
		@apply opacity-100 shadow-inner;
	}
	.lonk {
		@apply text-xs border py-1.5 px-2 rounded-full shadow-sm bg-opacity-60;
	}

	.lonk:hover {
		@apply opacity-100;
	}

	.i {
		@apply w-3 h-3 mr-1;
	}
</style>
