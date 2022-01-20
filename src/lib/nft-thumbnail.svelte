<script lang="ts">
	// TODO all of the avail props are logged out with $$props;
	console.log($$props);
	export let formatted_date = new Date($$props.created_date).toLocaleDateString('en-US');

	// placeholder until we have evaluation code online
	export let evaluation = "Durable";
	export let evaluation_class = "text-green-600";
	export let evaluation_details = "Metadata On-Chain, Image on IPFS";

	// if you want to properly export them you can do this
	export let image_url;
	export let name;
</script>

<!-- // Everythign below this is just html -->
<div class="bg-gray-50 p-4 border">
	<div class="text-center h-14 heading grid place-items-center pb-4">
		{name}
	</div>

	<img src={image_url} class="mx-auto w-32 pb-4" />

	<div class="text-center pb-4">
		Created: {formatted_date}
	</div>

	<hr />

	<div class="text-center pt-4">
		<div class="heading">
			Our Evaluation
		</div>
		<div class="{evaluation_class}">
			{evaluation}
		</div>
		<div>
			{evaluation_details}
		</div>
	</div>
</div>

<style>
	/* These styles only apply to this component */
</style>
