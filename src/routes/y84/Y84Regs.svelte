<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';
	import { divide } from './y84_ops';

	let { y84 }: { y84: Y84Emulator } = $props();
	let regs: number[] = $derived(y84.isHalted && (y84.getPC() || true) ? [...y84.getRegs()] : Array(16).fill(0));
	let labels = [...Array.from(Array(12), (_, i) => `R${i}`), 'VR', 'SP', 'LR', 'ZR'];
	let highlighted: number[] = $derived.by(() => {
		if (y84.isHalted) {
			let highlighted = [];
			highlighted.length = 0;
			let { Rt, Rm, Rn } = divide(y84.currentInstruction());
			if (Rt != null)
				highlighted.push(Rt);
			if (Rm != null)
				highlighted.push(Rm);
			if (Rn != null)
				highlighted.push(Rn);
			return highlighted;
		}
		return [];
	});
</script>

<style>
    .grid {
        height: 150px;
        width: 400px;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: 2px;


    }
		.highlighted {
				color: yellow;
		}
</style>

<div class="main">
	<div>PC: {y84.isHalted ? `${y84.getPC()} (line ${y84.sourceMap[y84.getPC()] ?? '-'})` : '---'}<br>
		{y84.isHalted ? y84.source.split('\n')[(y84.sourceMap[y84.getPC()] ?? 0) - 1] : '---'}<br><br></div>
	<div class="grid">
		{#each regs.entries() as [i, reg] (i)}
			<span style="min-width: 170px" class:highlighted={highlighted.includes(i)}>{labels[i]}: {reg}, 0x{(reg & 65535).toString(16).toUpperCase()}, '{String.fromCharCode(reg)}'</span>
		{/each}
	</div>
</div>