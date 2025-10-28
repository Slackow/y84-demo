<script>
	import Linkedin from './linkedin.svelte';
	import Github from './github.svelte';
	import Email from './email.svelte';
	import { onMount } from 'svelte';

	let canvas = $state();
	let x = 0;
	let speed = 5;
	onMount(() => {
		let id = setInterval(() => {
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, 320, 20);
			ctx.fillStyle = 'rgb(255 255 255)';
			speed = x >= 300 ? -5 : x <= 0 ? 5 : speed;
			x += speed;
			ctx.fillRect(x, 0, 20, 20);
		}, 20);
		return () => clearInterval(id);
	});
</script>
<footer >
<div style="display: flex; gap: 10px; padding-bottom: 10px">
	<Github link="https://www.github.com/Slackow" />
	<Linkedin link="https://www.linkedin.com/in/andrew-turcan/" />
	<Email link="mailto:aturcan@stevens.edu" />
</div>
<canvas bind:this={canvas} width="320" height="20"></canvas>
</footer>