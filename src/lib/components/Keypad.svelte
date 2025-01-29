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
						<button class="bounds" onclick={() => action(key)} {onkeydown}>{key.toUpperCase()}</button>
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
      opacity: 85%;
	}
	.bounds {
			width: 40px;
			height: 40px;
			font-size: 20px;
	}
	.outer:hover {
			opacity: 100%;
	}
	.row-bounds {
			display: flex;
			height: 40px;
	}
</style>