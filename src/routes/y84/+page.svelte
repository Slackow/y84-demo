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

	let { data } = $props();

	let y84 = new Y84Emulator();
	let code = $state('');
	let error: Y84Error | null = $state(null);

	$effect(() => {
		let id = setInterval(() => {
			if (error !== null) return;
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
			y84.tick();y84.tick();y84.tick();y84.tick();y84.tick();
		}, 20);
		return () => clearInterval(id);
	});
	let instruction = $state(0);
	$effect(() => {
		if (y84.isHalted) {
			instruction = y84.currentInstruction();
		}
	});

	async function onpick(e: { currentTarget: { value: string } }) {
		code = data.files.find(f => f.name === e.currentTarget.value)?.content ?? '';
		let { inst, data: dataSeg, sourceMap } = await processAssembly(code);
		let instShorts = hexCodeToShorts(inst.join('\n'));
		let dataShorts = dataSeg?.length ? Int16Array.from(hexCodeToShorts(dataSeg.join('\n'))?.inst ?? []) : undefined;
		if (instShorts) {
			y84.load(instShorts.inst, dataShorts, code, sourceMap);
		}
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

    @media all and (max-width: 1240px) {
				.full-code-area {
						column-count: 1;
						flex-direction: column-reverse;
				}
				.code-area {
						width: 450px;
				}
				.y84-regs {
						display: none;
				}
    }

		.lower {
        padding: 10px;
				margin-right: 10%;
		}

</style>

<svelte:head>
	<title>Y84</title>
	<meta name="description" content="A display of instructions" />
</svelte:head>


<div class="switch">
	<VBox>
		<h1>Y84 Demo</h1>
		<Y84Inst {instruction} />

		<HBox>
			<Picker options={["", ...data.files.map(f => f.name)]} label="Program:" {onpick} />
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
			<div class="y84-regs">
				<Y84Regs {y84} />
			</div>
		</div>
		<div class="lower">
			<button class="btn btn-xs btn-square no-animation"
							onclick={() => y84.toggleHalt()}>{y84.isHalted ? '▶ Play' : '⏸ Halt'}</button>
			<button class="btn btn-xs btn-square no-animation" onclick={() => y84.tick(true)}>⏩ Step</button>
			<button class="btn btn-xs btn-square no-animation" onclick={async () => await y84.reload()}>↻ Restart</button>
		</div>
		<span><a href="#diagram">Diagram</a>, <a href="#manual">Manual</a></span>
		<div style="height: 200px"></div>
		<div style="margin-left: 10%">
			<h1 id="diagram">Diagram</h1>
			<img src="/y84.png" alt="y84 CPU Design in Logisim-Evolution" width="80%">
			<p>This is a screenshot of the CPU as designed in <a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank">Logisim-Evolution</a><br>
				 You can run this yourself by loading the .circ file found <a href="https://github.com/Slackow/y84/blob/main/y84.circ" target="_blank">here</a>
			</p>
		</div>
		<Y84Faq />
		<Y84Documentation />
	</VBox>
</div>