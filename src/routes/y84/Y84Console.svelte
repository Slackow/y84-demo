<script lang="ts">
	import type { Y84Emulator } from './Y84Emulator.svelte';

	let {y84}: {y84: Y84Emulator} = $props();

	$effect(() => {
		if (y84.console) {
			let consoleEl = document.getElementsByClassName("console").item(0);
			if (consoleEl != null) {
				consoleEl.scrollTop = consoleEl.scrollHeight;
			}
		}
	});
</script>

<style>
    .console {
        resize: none;
        height: 100px;
				background-color: lightgray;
    }
</style>

<textarea bind:value={y84.console} disabled name="console" class="console" title="Console"></textarea>
