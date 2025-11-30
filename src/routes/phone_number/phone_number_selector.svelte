<script lang="ts">
	let text = $state("");
	// (32°F − 32) × 5/9 = 0°C
	function fToC(f: number) {
		return (f - 32) * 5 / 9
	}
	let phone_number = $derived.by(() => {
		let value = +text.trim();
		if (text && !isNaN(value)) {
			let result = `${Math.abs(Math.round(fToC(value)))}`.padStart(10, "0");
			if (result.length === 10){
				return result;
			}
		}
		return "0".repeat(10);
	});

</script>

<style>
	input {
			text-align: right;
			display: flex;
			background: none;
			color: white;
      width: 70%;
	}
	.container {
			width: fit-content;
			display: grid;
			flex-direction: column;
	}
	.item {
			/*border: #ff3e00 1px solid;*/
			padding: 5px;
	}
	.phone_number {
			width: max-content;
			margin: 0;
			display: inline;
	}
	span {
			display: flex;
			align-items: center;
	}
</style>

<div>
	<p>Enter your Phone Number in Fahrenheit</p>
	<div class="container">
		<span class="item input">
			<input bind:value={text}>ºF
		</span>
		<span>
			<span class="item phone_number">({phone_number.slice(0, 3)}) {phone_number.slice(3, 6)}-{phone_number.slice(6, )}&nbsp;</span>
			<span>ºC</span>
		</span>
	</div>
</div>