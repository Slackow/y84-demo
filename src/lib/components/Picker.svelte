<script lang="ts">
	let {
		options,
		label,
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
			<option>{option}</option>
		{/each}
	</select>

</label>