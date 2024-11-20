<script>
	import Y84Card from '$lib/components/Y84Card.svelte';
</script>

<Y84Card>
	<h1>What is Y84? Why does it exist?</h1>
	<p>Y84 is a project I developed for my computer architecture class.
		The project was to design a CPU with at least 4 registers and at least 4 unique instructions, including reading/writing memory.
		You also had to create an associated assembler, example program, and manual.
		Extra credit was available for going above and beyond, adding things like branching, additional instructions, pipelining, etc.
		I went a little overboard with my submission and created y84. I realized that creating snake was just barely achievable with everything
		I had learned in this course, so I went all in and made it happen.
	</p>
	<p>Y84 is a project made up of 2 components: A CPU designed in Logisim-Evolution, and an assembler that converts .y files
		into image files that can be loaded by Logisim-Evolution</p>
	<p>There are definitely some silly design choices, some on purpose (using &lt;&lt; in every single instruction) and
		others because of my limited knowledge at the time (dedicated instructions for specific external components) but
		overall I'm still very proud of this project.</p>
	<p>You can run this yourself in <a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank">Logisim-Evolution</a> by loading the .circ file found <a href="https://github.com/Slackow/y84/blob/main/y84.circ" target="_blank">here</a></p>
	<h1>What is this demo?</h1>
	<p>I wanted to learn Svelte5 and SvelteKit and try my hand at making a website from scratch, so I decided to make an emulator of my cpu running in JavaScript.
	I also figured it would just be a neat project to show off, and much of this page was inspired by Khan Academy's code editor,
		where I learned to program for the first time.</p>
</Y84Card>