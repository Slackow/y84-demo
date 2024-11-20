<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte.js';
	import HBox from '$lib/components/HBox.svelte';
	import Y84Error from './Y84Error';

	let { y84, code = $bindable(), onErr, small = false }: { y84: Y84Emulator, code: string, onErr: (err: Y84Error | null) => void, small?: boolean } = $props();

	async function oninput() {
		try {
			await y84.loadCode(code);
			onErr(null);
		} catch (error: any) {
			if (!(error instanceof Y84Error)) {
				error = new Y84Error(1, error?.message ?? "Unknown Error Occurred");
			}
			onErr(error);
		}
	}

	let lineNumbersText = $derived(Array.from(code.matchAll(/\n|$/g), (_, i) => i + 1).join('\n'));

	let lineNumbers: HTMLElement, codeArea: HTMLElement;

	let onscroll = () => {
		lineNumbers.scrollTop = codeArea.scrollTop;
	};
</script>

<style>
    textarea {
        font-family: var(--font-mono);
        font-size: 16pt;
    }

    .code {
        height: 500px;
        width: 650px;
        min-width: 300px;
        max-width: 800px;
        resize: none;
				white-space: pre;
    }

		.small {
				width: 348px;
		}

    .lineNumbers {
        height: 500px;
        width: 40px;
				min-width: 40px;
        overflow: hidden;
        resize: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        background-color: lightgray;
        text-align: right;
				/*border-radius: 5px 0 0 5px;*/
    }
</style>

<HBox>
	<textarea disabled class="lineNumbers" bind:this={lineNumbers}>{lineNumbersText}</textarea>
	<textarea bind:value={code} class="code" bind:this={codeArea} class:small={small} {onscroll} {oninput} wrap="soft"></textarea>
</HBox>