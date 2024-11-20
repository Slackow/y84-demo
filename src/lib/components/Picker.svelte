<script lang="ts">
	let {
		options,
		label,
		selected,
		onpick,
	}: {
		options: string[],
		selected?: string,
		label?: string,
		onpick: (e: Event & { currentTarget: HTMLSelectElement }) => void,
	} = $props();
</script>


<label>
	{label ?? ""}
	<select name={label || "picker"} onchange={onpick}>
		{#each options as option (option)}
			<option selected={option === selected}>{option}</option>
		{/each}
	</select>
</label>