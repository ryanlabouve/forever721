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

		let evaluation = await evaluateNft(token_uri);
		console.log('evaluation: ', evaluation);

		let grade = evaluation[0];

		let evaluationClass;
		switch (grade) {
			case 'Green':
				evaluationClass = 'text-green-600';
				break;
			case 'Yellow':
				evaluationClass = 'text-orange-600';
				break;
			case 'Red':
				evaluationClass = 'text-red-600';
				break;
			default:
				evaluationClass = 'text-gray-600';
		}

		let evaluationMessage = evaluation[1].join('<br/>');
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
		<div class={evaluationClass}>
			{grade}
		</div>
		<div>
			{evaluationMessage}
		</div>
	</div>

	<a
		class="bg-zinc-600 text-white rounded-full p-3 px-5"
		href={`/mint/${token_address}/${token_id}`}
	>
		Mint
	</a>
</div>
