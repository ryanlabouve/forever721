<script type="ts">
	export let label;
	export let color;
	export let illo;
	export let heading;
	export let exampleLink;
	export let exampleLabel;
	export let description;
</script>

<div class="bg-white rounded-md p-3 border border-zinc-300 shadow-sm">
	<div
		class="inline-block py-0.5 px-2 text-white font-bold text-sm mb-2"
		class:bg-green-500={color === 'green'}
		class:bg-yellow-500={color === 'yellow'}
		class:bg-red-500={color === 'red'}
	>
		{label}
	</div>
	<div class="text-xl">
		{heading}
	</div>
	<div class="mb-3">
		{description}
	</div>
	<div class="text-xs">
		{#if exampleLink && exampleLabel}
			Example: <a href={exampleLink}>{exampleLabel}</a>
		{/if}
	</div>
</div>
