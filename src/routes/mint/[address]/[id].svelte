<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as IPFS from 'ipfs-core';

	onMount(async () => {
		// Do initialization things here
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
