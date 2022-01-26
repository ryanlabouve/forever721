<script lang="ts">
	import { onMount } from 'svelte';

	import { evaluateNft } from './utils/functions';

	console.log($$props);

	// if you want to properly export them you can do this
	export let metadata;
	export let image_url;
	export let description;
        export let token_uri;
        export let name = metadata.name;

	console.log('tokenuri: ', token_uri);
	export let evaluation;
	export let grade;
        export let evaluationClass;
	export let evaluationMessage;
	// Everything below this is just html

	onMount(async () => {
		let evaluation = await evaluateNft(token_uri);
		console.log('evaluation: ', evaluation);

		let grade = evaluation[0];

                let evaluationClass;
                switch(grade) {
                        case "Green":
                                evaluationClass = "text-green-600";
                                break;
                        case "Yellow":
                                evaluationClass = "text-orange-600";
                                break;
                        case "Red":
                                evaluationClass = "text-red-600";
                                break;
                        default:
                                evaluationClass = "text-gray-600";
                }

		let evaluationMessage = evaluation[1].join("<br/>");
	});
</script>

<div class="bg-gray-50 p-4 border">
        <div class="text-center h-14 heading grid place-items-center pb-4">
		{name}
	</div>

	<img src={image_url} class="mx-auto w-32 pb-4" />

	<hr />

	<div class="text-center pt-4">
		<div class="heading">
			Our Evaluation
		</div>
		<div class="{evaluationClass}">
			{grade}
		</div>
		<div>
			{evaluationMessage}
		</div>
        </div>
</div>

<style>
	/* These styles only apply to this component */
</style>
