<script lang="ts">
	import { divide, getMessage, getTextInstruction } from './y84_ops.js';
	import HBox from '$lib/components/HBox.svelte';

	let { instruction }: { instruction: number } = $props();

	let message = $derived(getMessage(instruction));
	let dividedKeys = $derived(Object.keys(divide(instruction)));

	function flipBit(i: number) {
		instruction ^= 1 << i;
	}

</script>

<style>
    button {
        width: 20px;
        height: 20px;
        padding: 0;
        background-color: black;
        color: white;
        transition: 150ms ease-in-out;
    }
    .inst-heading {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 25px;
        outline: red solid 3px;
        border-radius: 2px;
        outline-offset: -4px;
        text-align: center;
        padding: 0;
        margin: 0;
    }

    .on {
        background-color: green;
    }

    .imm8 {
        width: 160px;
    }

    .imm12 {
        width: 240px;
    }

    .w-320 {
        width: 320px;
        display: flex;
    }

    .textInstruction {
        font-family: var(--font-mono);
    }
</style>


<div class="w-320">
	{#each dividedKeys as key (key)}
		<span class={key} class:inst-heading={true}>{key.replace('blank', '----')}</span>
	{/each}
</div>
<HBox>
	{#each Array.from(Array(16), (_, i) => 15 - i) as i (i)}
		<button class='btn btn-xs btn-square no-animation' class:on={((instruction >> i) & 1) === 1}
						onclick={() => flipBit(i)}>{(instruction >> i) & 1}</button>
	{/each}
</HBox>
<div class="textInstruction">{getTextInstruction(instruction)}</div>