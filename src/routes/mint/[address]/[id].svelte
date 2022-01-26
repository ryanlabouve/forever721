<script lang="ts">
	import { page } from '$app/stores';
	import BadPolaroid from '$lib/ui/bad-polaroid.svelte';
	import { onMount } from 'svelte';

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

<BadPolaroid
	url={'https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1948.png'}
/>
