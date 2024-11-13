<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';

	let { y84 }: { y84: Y84Emulator } = $props();
	let regs: number[] = $state(Array(16).fill(0));
	let labels = [...Array.from(Array(12), (_, i) => `R${i}`), 'VR', 'SP', 'LR', 'ZR'];
	$effect(() => {
		if (y84.isHalted) {
			regs = [...y84.getRegs()];
			y84.getPC();
		}
	});
</script>

<style>
	.main {
      height: 516px;
	}
</style>

<div class="main">
	PC: {y84.isHalted ? `0x${y84.getPC().toString(16)}` : '---'}<br>
	{y84.isHalted ? y84.source.split('\n')[(y84.sourceMap[y84.getPC()] ?? 0) - 1] : '---'}<br><br>
	{#each regs.entries() as [i, reg] (i)}
		{labels[i]}: {reg}, 0x{(reg & 65535).toString(16).toUpperCase()}, '{String.fromCharCode(reg)}'<br>
	{/each}
</div>