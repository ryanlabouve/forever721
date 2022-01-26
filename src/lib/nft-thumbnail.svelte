<script lang="ts">
	import { onMount } from 'svelte';
	import { evaluateNft } from './utils/functions';

	// if you want to properly export them you can do this
	export let metadata;
	export let image_url;
	export let description;
	export let token_uri;
	export let token_address;
	export let name = metadata.name;

	console.log('tokenuri: ', token_uri);
	export let evaluation;
	export let grade;
	export let evaluationClass;
	export let evaluationMessage;
	let token_id;

	onMount(async () => {
		token_id = token_uri.split('/').slice(-1).join(''); // TODO: do this less terribly

		evaluation = await evaluateNft(token_uri);
		grade = evaluation[0].toLowerCase();
		evaluationMessage = evaluation[1].join('<br/>');
	});
</script>

<div class="bg-gray-50 p-4 border">
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
		>
			{grade}
		</div>
		<div>
			{@html evaluationMessage}
		</div>
	</div>

	<div class="my-4">
		<a
			class="bg-zinc-600 text-white rounded-full p-2.5 px-5 text-sm"
			href={`/mint/${token_address}/${token_id}`}
		>
			Prepare to Mint →
		</a>
	</div>
</div>
