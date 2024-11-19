<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>
<style>
    .docs {
        border: black solid 2px;
        border-radius: 4px;
        padding: 10px;
        width: 80%;
        margin-left: 10%;

        background-color: var(--color-bg-1);
        background-size: auto auto;
        background-image: linear-gradient(135deg, rgba(26, 26, 53, 1) 0%, rgba(41, 41, 73, 1) 50%, rgba(88, 88, 120, 1) 100%);
    }
</style>

<div class="docs">
	{@render children()}
</div>