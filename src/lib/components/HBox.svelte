<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: {children: Snippet} = $props();
</script>

<style>
    .horizontal {
        display: flex;
    }
</style>

<div class="horizontal">
	{@render children()}
</div>