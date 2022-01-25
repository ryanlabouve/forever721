<script lang="ts">
	import { evaluateNft } from './utils/functions';

	console.log($$props);
	// TODO all of the avail props are logged out with $$props;

	// if you want to properly export them you can do this
	export let metadata;
	export let image_url;
	export let created_date;
	export let description;

	const evaluation = evaluateNft(metadata);
	const grade = evaluation[0];
	const evaluationMessage = evaluation[1][0];
	// Everythign below this is just html
</script>

<div class="bg-gray-50 p-4 border">
	<img src={image_url} />

	<div>
		Created at: {created_date}
	</div>
	<div class="truncate">
		Description: {description}
	</div>
	<p>Evaluation: {grade}</p>
	<p>Message: {evaluationMessage}</p>
</div>

<style>
	/* These styles only apply to this component */
</style>
