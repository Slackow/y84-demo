<script>
	import YellowVsOrange from '$lib/components/misc/YellowVsOrange.svelte';
	import Links from './links.svelte';
</script>


<h1>andrewturcan.com</h1>

<!--<div style="display: flex;width: 50%; justify-self: center; background: #4075a6; padding: 30px; border-radius: 38px">-->
<!--	<img src="/prof.jpeg" alt="Me, Andrew Turcan" style="width: 200px; border-radius: 38px;border: red solid 3px; margin-right: 20px">-->
<!--	<p style="border-radius: 38px;padding: 30px;background: #dedeff;color: black">Hi, my name is Andrew. I’m a Computer Science graduate from Stevens Institute of Technology (Class of 2025), currently pursuing my Master’s degree, expected May 2026.</p>-->
<!--</div>-->

<p>Hi, my name is Andrew. I’m a Computer Science graduate from Stevens Institute of Technology (Class of 2025), currently pursuing my Master’s degree, expected May 2026.</p>
<p>This page serves as a resume/demo of projects I have worked on and my experience in software development.</p>
<h2>Projects</h2>

<ul>
	<li><strong>y84</strong> - Virtual 16-bit CPU design
		<br>Interactive Demo: <a href="/y84" target="_blank">andrewturcan.com/y84</a>
		<br>Features: Basic arithmetic, conditional jumping, memory operations, and interactive components (keyboard,
		screen, terminal).
		<br>Uses: SvelteKit, Python (Assembler), Logisim
	</li>
	<li><strong>DanuBot</strong> - Versatile Discord bot
		<br>Features: Plays music, sends alerts, integrates ChatGPT for responses.
		<br>Tech: Java, Discord4j, ChatGPT
	</li>
	<li><strong>SwiftAA</strong> - Speedrunning assistant for Minecraft, in the form of a macOS app.
		<br>Features: Progress tracker, livestream overlay, used by 50+ speedrunners.
		<br>Tech: Swift, SwiftUI
	</li>
	<li><strong>PackScript</strong> - Programming/templating language
		<br>Features: Python based code templating, designed for Minecraft scripting, and accompanied with a VSCode
		extension and Minecraft mod.
		<br>Tech: Python, JavaScript, VSCode
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
<p><strong>Software:</strong> Git, ReactJS, NextJS, VSCode, Gradle, IntelliJ, NodeJS, ANTLR, Svelte, SvelteKit</p>

<h2>Education</h2>

<p><strong>Stevens Institute of Technology</strong>, Hoboken, NJ</p>
<p>Master of Science in Computer Science (Expected May 2026)</p>
<p>Bachelor of Science in Computer Science (Received May 2025)</p>
<p><strong>Relevant Courses:</strong> Web Programming, Unix Programming, Artificial Intelligence, AGILE, Computer Architecture,
	Compiler Design,<br>System Administration, Systems Programming, Operating Systems, Theory of Computation,
	Discrete Math, Algorithms, Data Structures</p>
<h2>Yellow vs Orange</h2>
<p>Here's a neat little simulation I wrote up (it goes on forever)</p>
<YellowVsOrange />
<br>
<p>Make sure you also checkout my <a href="/y84" target="_blank">y84 Demo</a>!</p>
<Links />

<svelte:head><title>andrewturcan.com</title></svelte:head>