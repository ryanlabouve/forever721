<script lang="ts">
	import { page } from '$app/stores';
	import ConnectorBadge from '$lib/header/connector-badge.svelte';
</script>

<header class="flex px-3 py-8  items-center">
	<div class="flex-grow font-bold heading">Forever721</div>

	<a href="#scan-an-nft" class="px-2 lonk">Scan an NFT</a>
	<a href="#learn-more" class="px-2 lonk">Learn More</a>
	<div>
		<ConnectorBadge />
	</div>
</header>

<style>
	.lonk {
		@apply text-xs;
	}
</style>
