<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';

	const { y84 }: { y84: Y84Emulator } = $props();
</script>

<style>
	.pixel {
			width: 48px;
			height: 48px;
			background-color: white;
			border: lightgray solid 2px;
	}
	.pixel[data-state="1"] {
			background-color: lime;
	}
	.screen {
			display: inline-grid;
			grid-template-columns: repeat(8, auto);
			direction: rtl;
			gap: 0;
	}

</style>

<div class="screen" tabindex="-1" contenteditable="false" role="application" onkeydown={e => {
	if (e.key.length === 1) {
		y84.pressKey(e.key.charCodeAt(0));
	} else if (e.key === 'Enter') {
		y84.pressKey(10);
	}
}}>
{#each y84.screen.entries() as [i, pixel] (i)}
	<div class="pixel" data-state={pixel}></div>
{/each}
</div>