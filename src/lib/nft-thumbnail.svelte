<script lang="ts">
	import { onMount } from 'svelte';
	import { evaluateNft } from './utils/functions';

	// if you want to properly export them you can do this
	export let metadata;
	export let image_url;
	export let token_uri;
	export let token_address;
	export let name = metadata.name;

	console.log('tokenuri: ', token_uri);

	let evaluation;
	let grade;

	let token_id;

	let evaluations = [];

	onMount(async () => {
		token_id = token_uri.split('/').slice(-1).join(''); // TODO: do this less terribly

		evaluation = await evaluateNft(token_uri);
		grade = evaluation.grade_text.toLowerCase();
		evaluations = [evaluation.uri_type_text, evaluation.image_location_text];
	});
</script>

<div class="flex flex-col justify-between bg-gray-50 p-4 border">
	<div>
		<div class="text-center h-14 heading grid place-items-center pb-4">
			{name}
		</div>

		<img src={image_url} alt={name} class="mx-auto w-32 pb-4" />

		<hr />

		<div class="text-center pt-4">
			<div class="heading">Our Evaluation</div>
			<div
				class:text-gray-600={!grade}
				class:text-green-600={grade == 'green'}
				class:text-orange-600={grade == 'yellow'}
				class:text-red-600={grade == 'red'}
				class="capitalize"
			>
				{grade}
			</div>

			<ul class="my-4">
				{#each evaluations as evaluation}
					<li class="text-sm">{evaluation}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="my-4 mx-auto">
		<a
			class="bg-zinc-600 text-white rounded-full p-2.5 px-5 text-sm"
			href={`/mint/${token_address}/${token_id}`}
		>
			Prepare to Mint →
		</a>
	</div>
</div>
