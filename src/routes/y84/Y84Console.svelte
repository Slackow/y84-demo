<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';

	let {y84}: {y84: Y84Emulator} = $props();
	let consoleEl: HTMLElement;

	$effect(() => {
		if (y84.console) {
			consoleEl.scrollTop = consoleEl.scrollHeight;
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
    .console {
        resize: none;
        height: 100px;
				background-color: lightgray;
    }
</style>

<textarea bind:this={consoleEl} readonly name="console" class="console" title="Console" tabindex="0" {onkeydown}>{y84.console}{y84.isHalted ? '' : '|'}</textarea>
