<script lang="ts">
	let {
		keys,
		action,
		onkeydown,
	}: {
		keys: string[][],
		action: (key: string) => void,
		onkeydown: (e: KeyboardEvent) => void,
	} = $props();

</script>

<div class="outer">
	{#each keys as row}
		<div class="row-bounds">
			{#each row as key}
				<div class="bounds">
					{#if key}
						<button class="bounds" tabindex="0" onclick={() => action(key)} {onkeydown}>{key.toUpperCase().trim()}</button>
					{/if}
				</div>
			{/each}
		</div>
		{/each}
</div>

<style>
	.outer {
			display: flex;
      flex-direction: column;
      opacity: 0.95;
	}
	.bounds {
			width: 40px;
			height: 40px;
			font-size: 20px;
	}
	button.bounds {
			background: white;
			border-radius: 5px;
			border: black 2px solid;
	}
	button.bounds:active {
			background: gray;
	}
	.row-bounds {
			display: flex;
			height: 40px;
	}
</style>