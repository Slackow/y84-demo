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

	let { data } = $props();

	let y84 = new Y84Emulator();

	$effect(() => {
		let id = setInterval(() => {
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

</script>

<style>

    .switch {
        display: flex;
        justify-content: center;
        align-items: center;
    }

		.right-side {
        width: 420px;
		}

</style>

<svelte:head>
	<title>Y84</title>
	<meta name="description" content="A display of instructions" />
</svelte:head>
<div class="switch">
	<div></div>
	<VBox>
		<h1>Y84</h1>
		<Y84Inst {instruction} />

		<HBox>
			<Picker options={["", ...data.files.map(f => f.name)]} label="Program:" onpick={(e) => {
				let program = hexCodeToShorts(data.files.find(f => f.name === e.currentTarget.value)?.content ?? "");
				if (program != null) y84.load(program.inst);
			}} />
			<button class="btn btn-xs btn-square no-animation" onclick={() => y84.toggleHalt()}>{y84.isHalted ? '▶' : '⏸'}</button>
			<button class="btn btn-xs btn-square no-animation" onclick={() => y84.tick(true)}>⏩</button>
			<button class="btn btn-xs btn-square no-animation" onclick={() => y84.reload()}>↻</button>
		</HBox>
		<HBox>
			<Y84CodeArea {y84} />
			<VBox class="right-side">
				<Y84Console {y84} />
				<Y84Screen {y84} />
			</VBox>
			<Y84Regs {y84} />
		</HBox>
	</VBox>
</div>