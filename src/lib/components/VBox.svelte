<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, class: className = "" }: {children: Snippet, class?: string} = $props();
</script>

<style>
	.vert {
			display: inline-grid;
			grid-template-columns: auto;
			/*all: initial;*/
	}
</style>

<div class="vert ${className}">
	{@render children()}
</div>