<script lang="ts">
	import { hexCodeToShorts } from './y84_ops.js';
	import { Y84Emulator } from './Y84Emulator.svelte';
	import Y84Screen from './Y84Screen.svelte';
	import Picker from '$lib/components/Picker.svelte';
	import Y84Console from './Y84Console.svelte';
	import HBox from '$lib/components/HBox.svelte';
	import VBox from '$lib/components/VBox.svelte';
	import Y84CodeArea from './Y84CodeArea.svelte';
	import Y84Inst from './Y84Inst.svelte';
	import Y84Regs from './Y84Regs.svelte';
	import { processAssembly } from './y84_comp';
	import Y84Documentation from './Y84Documentation.svelte';
	import type Y84Error from './Y84Error';
	import { onMount } from 'svelte';
	import Y84Faq from './Y84Faq.svelte';
	import { downloadData } from '$lib';
	import Modal from '$lib/components/Modal.svelte';

	let { data } = $props();

	let y84 = new Y84Emulator();
	let code = $state('');
	let error: Y84Error | null = $state(null);
	let speed = $state(20);
	let showDownloadModal = $state(false);
	let showImportModal = $state(false);
	let fileName = $state('');
	let importFile: HTMLInputElement = $state()!;

	$effect(() => {
		let id = setInterval(() => {
			if (error !== null) return;
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
		}, speed);
		return () => clearInterval(id);
	});
	let instruction = $state(0);
	$effect(() => {
		if (y84.isHalted) {
			instruction = y84.currentInstruction();
		}
	});

	async function onpick(e: { currentTarget: { value: string } }) {
		fileName = e.currentTarget.value;
		code = data.files.find(f => f.name === e.currentTarget.value)?.content ?? '';
		await y84.loadCode(code);
		error = null;
	}

	onMount(() => {
		onpick({ currentTarget: { value: 'snake' } });
	});

</script>

<style>

    .switch {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 75%;
        margin-left: 12.5%;
    }

    .right-side {
        width: 420px;
    }

    .h-200 {
        height: 200px;
    }

    .grayout {
    }

    .stack {
        display: grid;
    }

    .stack > * {
        grid-row: 1;
        grid-column: 1;
    }

    .err-msg {
        color: black;
        opacity: 100%;
    }

    .err-box {
        width: 200px;
        height: 70px;
        margin: 30% auto;
        border: 5px solid gray;
        border-radius: 5px;
        background: lightgray;
        opacity: 100%;
        padding: 10px;
    }

    .center {
        margin: 0 auto;
    }

		.full-code-area {
				column-count: 2;
				display: flex;
		}

    @media all and (max-width: 1230px) {
				.full-code-area {
						column-count: 1;
						flex-direction: column-reverse;
				}
				.code-area {
						width: 400px;
				}
				.y84-regs {
						display: none;
				}
    }

		.lower {
        padding: 10px;
				margin-right: 10%;
		}

		.hide {
				display: none;
		}

</style>

<svelte:head>
	<title>Y84</title>
	<meta name="description" content="A display of instructions" />
</svelte:head>


<div class="switch">
	<VBox>
		<h1>Y84 Demo</h1>
		<h2 style="margin: 0">Instruction Inspector</h2>
		<Y84Inst {instruction} />

		<HBox>
			<Picker options={["", ...data.files.map(f => f.name)]} selected="snake" label="Program:" {onpick} />
		</HBox>
		<div class="full-code-area">
			<div class="code-area">
				<Y84CodeArea {y84} {code} onErr={e => error = e} />
			</div>
			<div class="right-side">
			<VBox>
				<Y84Console {y84} />
				{#if error}
					<div class="stack">
						<div class="grayout">
							<Y84Screen {y84} />
						</div>
						<div class="err-box">
							<span class="err-msg">{error.message}, Line: {error.lineNumber}</span>
						</div>
					</div>
				{:else}
					<Y84Screen {y84} />
				{/if}
			</VBox>
			</div>
		</div>
		<div class="lower">
			<button class="btn btn-xs btn-square no-animation"
							onclick={() => y84.toggleHalt()}>{y84.isHalted ? '▶ Play' : '⏸ Halt'}</button>
			<button class="btn btn-xs btn-square no-animation" onclick={() => y84.tick(true)}>⏩ Step</button>
			<button class="btn btn-xs btn-square no-animation" onclick={async () => await y84.reload()}>↻ Restart</button>
			<button class="btn btn-xs btn-square no-animation" onclick={async () => await y84.reload(true)}>↻ Restart & Halt</button>
			<Picker selected="1000hz (default)" options={["100hz", "1000hz (default)", "5000hz"]} onpick={e => {
				speed = 20000 / parseInt(e.currentTarget.value);
			}}></Picker>
			<button class="btn btn-xs btn-square no-animation" onclick={() => showDownloadModal = true}>Export</button>
			<button class="btn btn-xs btn-square no-animation" onclick={() => showImportModal = true}>Import</button>
		</div>

		<div class="y84-regs" style="height: 200px" class:hide={!y84.isHalted || !y84.source}>
			<Y84Regs {y84} />
		</div>
		<div style="margin-left: 10%">
			<h1 id="diagram">Diagram</h1>
			<img src="/y84.png" alt="y84 CPU Design in Logisim-Evolution" width="80%">
			<p>This is a screenshot of the CPU as designed in <a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank">Logisim-Evolution</a>
			</p>
		</div>
		<Y84Faq />
		<Y84Documentation />
	</VBox>
</div>

<Modal bind:showModal={showDownloadModal}>
	{#snippet header()}
		<h1>Download Code</h1>
	{/snippet}
	<label>File Name: <input bind:value={fileName}></label><br>
	<label>Download Source (.y): <button disabled={!fileName.trim()} onclick={() => {
		if (fileName.trim()) {
			fileName = fileName.trim();
			downloadData(new Blob([code]), fileName.endsWith('.y') ? fileName : `${fileName}.y`);
		}
	}}>Download</button></label><br>
	<label>Download Logism File(s) (_inst, _data): <button disabled={!fileName.trim()} onclick={async () => {
		if (fileName.trim()) {
			fileName = fileName.trim();
			let { inst, data } = await processAssembly(code);
			downloadData(new Blob(inst), `${fileName}_inst`);
			if (hexCodeToShorts(data.join('\n'))?.inst.some(a => a !== 0)) {
				downloadData(new Blob(data), `${fileName}_data`);
			}
		}
	}}>Download</button></label>
</Modal>

<Modal bind:showModal={showImportModal}>
	{#snippet header()}
		<h1>Import .y file</h1>
	{/snippet}
	<form onsubmit={(e: SubmitEvent) => {
		e.preventDefault();

		if (importFile && importFile.files?.length) {
			const file = importFile.files[0];
			const reader = new FileReader();

			reader.onload = (event) => {
				if (typeof event.target?.result === 'string') {
					code = (event.target?.result) ?? '';
					y84.loadCode(code);
					error = null;
					showImportModal = false;
				}
			};

			reader.onerror = (error) => {
				console.error('Error reading file:', error);
			};

			reader.readAsText(file); // Read file as text
		} else {
			console.log('No file selected');
		}
	}}>
		<VBox>
			<label><input required bind:this={importFile} type="file"></label>
			<label><button type="submit">Import</button></label>
		</VBox>
	</form>
</Modal>