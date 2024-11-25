<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';

	const { y84 }: { y84: Y84Emulator } = $props();

	let canvas: HTMLCanvasElement;

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
	}
</style>

<canvas bind:this={canvas} width="400" height="400" tabindex="0" {onkeydown}></canvas>