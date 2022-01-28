<script lang="ts">
	import Header from '$lib/header/header.svelte';
	import '../app.css';
</script>

<div class="m-auto max-w-4xl">
	<Header />
</div>
<main>
	<slot />
</main>
