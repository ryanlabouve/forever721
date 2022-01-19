<script lang="ts">
	// TODO all of the avail props are logged out with $$props;
	console.log($$props);
	// if you want to properly export them you can do this
	export let image_url;
	export let created_date;
	export let description;
</script>

<!-- // Everythign below this is just html -->
<div class="bg-gray-50 p-4 border">
	<img src={image_url} />

	<div>
		Created at: {created_date}
	</div>
	<div class="truncate">
		Description: {description}
	</div>
</div>

<style>
	/* These styles only apply to this component */
</style>
