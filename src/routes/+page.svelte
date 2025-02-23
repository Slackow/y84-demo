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

<p>Hi, my name is Andrew, I'm a CS major at Stevens Institute of Technology,<br> graduating May 2025 with my Bachelor's and May 2026 for my Master's.</p>

<h2>Projects</h2>

<ul>
	<li><strong>y84</strong> - Virtual 16-bit CPU design
		<br>Interactive Demo: <a href="https://andrewturcan.com/y84" target="_blank">andrewturcan.com/y84</a>
		<br>Features: Basic arithmetic, conditional jumping, memory operations, and interactive components (keyboard, screen, terminal).
		<br>Uses: SvelteKit, Python (Assembler), Logisim
	</li>
	<li><strong>DanuBot</strong> - Versatile Discord bot in Java
		<br>Capabilities: Plays music, sends alerts, integrates ChatGPT for responses.
		<br>Tech: Java, Discord4j
	</li>
	<li><strong>SwiftAA</strong> - Speedrunning assistant for Minecraft
		<br>Features: Progress tracker, livestream overlay, used by 50+ speedrunners.
		<br>Tech: Swift, SwiftUI
	</li>
	<li><strong>Functional MCFunctions</strong> - Programming/templating language
		<br>Features: Type system, code templating, designed for Minecraft scripting.
		<br>Tech: Java, ANTLR
	</li>
</ul>

<h2>Experience</h2>

<ul>
	<li><strong>Software Engineering Intern</strong>, UKG - Branchburg, NJ (05/2024 - 08/2024)
		<br>- Automated tests for InTouch devices using REST Assured
		<br>- Fixed UI bugs and developed backend endpoints
		<br>- Tech: Java, SQL, ReactJS, HTML/CSS
	</li>
	<li><strong>Full Stack Developer Intern</strong>, MEMX - Jersey City, NJ (01/2023 - 05/2023)
		<br>- Contributed to options market functionality in a User Portal web app
		<br>- Improved system error reporting with Slack and Confluence
		<br>- Tech: ReactJS, NodeJS, Express, PostgreSQL
	</li>
</ul>

<h2>Skills</h2>

<p><strong>Languages:</strong> Java, JavaScript, Swift, C, C++, Python, PostgreSQL, HTML, CSS, OCaml, Kotlin</p>
<p><strong>Software:</strong> Git, ReactJS, NextJS, VSCode, Gradle, IntelliJ, NodeJS, MongoDB, ANTLR, Svelte, SvelteKit</p>

<h2>Education</h2>

<p><strong>Stevens Institute of Technology</strong>, Hoboken, NJ</p>
<p>Master of Science in Computer Science (Expected May 2026)</p>
<p>Bachelor of Science in Computer Science (Expected May 2025)</p>
<p><strong>Relevant Courses:</strong> Computer Architecture, Compilers, Systems Programming, Web Programming, System Administration,<br> Theory of Computation, Discrete Math, Algorithms, Data Structures</p>

<p>You can also just watch the square go side to side if you want to.</p>
<canvas bind:this={canvas} width="200" height="20"></canvas>

<p>Contact me: <a href="mailto:aturcan@stevens.edu">aturcan@stevens.edu</a></p>
<p>Visit my <a bind:this={gh} href="https://github.com/Slackow" target="_blank">GitHub</a></p>
<p>Visit my <a href="https://www.linkedin.com/in/andrew-turcan/" target="_blank">LinkedIn</a></p>

<svelte:head><title>andrewturcan.com</title></svelte:head>