<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="flex px-3 py-8  items-center">
	<div class="flex-grow font-bold heading">NFTrusty</div>

	<div class="px-2 lonk">Connect Wallet</div>
	<div class="px-2 lonk">Scan an NFT</div>
	<div class="px-2 lonk">Learn More</div>
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
</style>
