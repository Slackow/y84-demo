<script>
	import { onMount } from 'svelte';

	let gh = $state();
	let canvas = $state();
	let x = 0;
	let speed = 5;
	onMount(() => {
		setTimeout(() => gh.href = 'https://github.com/Sl' + 'ac' + 'kow', 500);
		let id = setInterval(() => {
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, 200, 20);
			ctx.fillStyle = "rgb(54 0 0)";
			speed = x >= 180 ? -5 : x <= 0 ? 5 : speed;
			x += speed;
			ctx.fillRect(x, 0, 20, 20);
		}, 20);
		return () => clearInterval(id);
	});
</script>



<h1>andrewturcan.com</h1>

<p>Hi, my name is Andrew, I'm a CS major at Steven's Institute of Technology graduating May of 2025</p>
<p>I plan to add more to this site one day, but for now I have this demo of Y84, a project I worked on during university.</p>
<p>You can also just watch the square go side to side if you want to.</p>
<p>Cool Demo: <a href="/y84">y84</a></p>


<p>Contact me: aturcan@stevens.edu</p>
<p>Visit my <a bind:this={gh} href="/" target="_blank">GitHub</a></p>
<p>Visit my <a href="https://www.linkedin.com/in/andrew-turcan/" target="_blank">LinkedIn</a></p>
<canvas bind:this={canvas} width="200" height="20"></canvas>

<svelte:head><title>andrewturcan.com</title></svelte:head>