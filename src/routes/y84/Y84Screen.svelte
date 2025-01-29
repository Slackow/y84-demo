<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';
	import Keypad from '$lib/components/Keypad.svelte';

	const { y84 }: { y84: Y84Emulator } = $props();

	let canvas: HTMLCanvasElement;

	let meta = $derived.by(() => {
		let metaLine = y84.source.split('\n').findLast(line => line.trim().startsWith('////'));
		if (metaLine == null) return {};
		try {
			return JSON.parse(metaLine.trim().slice(4).trim());
		} catch (e) {
			return {};
		}
	});

	$effect(() => {
		let ctx = canvas.getContext('2d')!;
		ctx.clearRect(0, 0, 400, 400);
		ctx.fillStyle = "rgb(0 255 0)";
		for (let [i, pixel] of y84.screen.entries()) {
			if (pixel) {
				ctx.fillRect(350 - (i % 8) * 50, (i >> 3) * 50, 50, 50);
			}
			ctx.strokeRect(350 - (i % 8) * 50, (i >> 3) * 50, 50, 50);
		}
	});

	function onkeydown(e: KeyboardEvent) {
		if (e.key.length === 1) {
			y84.pressKey(e.key.charCodeAt(0));
		} else if (e.key === 'Enter') {
			y84.pressKey(10);
		}
	}

</script>

<style>
	canvas {
			background-color: white;
			width: 400px;
			height: 400px;
			grid-area: 1 / 1;
	}
	.outer {
			display: grid;
	}
	.keypad {
			grid-area: 1 / 1;
      align-self: end;
			justify-self: right;
  }
</style>
<div class="outer">
	<canvas bind:this={canvas} width="400" height="400" tabindex="0" {onkeydown}></canvas>
	{#if meta.keys}
		<div class="keypad">
			<Keypad keys={meta.keys} action={key => y84.pressKey(key.charCodeAt(0))} {onkeydown} />
		</div>
	{/if}
</div>
