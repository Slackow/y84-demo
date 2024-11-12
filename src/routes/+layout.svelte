<script lang="ts">
	import '../app.css';

	let { children } = $props();

</script>

<style>
    main {
        margin: 0 auto;
    }
</style>

<main>
	{@render children()}
</main>