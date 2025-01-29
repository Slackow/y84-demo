<script>
	import Y84Card from '$lib/components/Y84Card.svelte';
</script>

<style>
	h1, h2, h3 {
			color: white;
	}
	code {
			background-color: #111;
	}

</style>

<Y84Card>
	<h1 id="manual">Y84 Manual</h1>
	<h2>Specs</h2>
	<ul>
		<li>16-bit addressed general purpose memory (2 bytes represent a unique address)</li>
		<li>16-bit addressed instruction memory</li>
		<li>16 16-bit registers
			<ul>
				<li>12 general purpose registers (R0, R1, …, R11)</li>
				<li>3 with designated purposes (VR, SP, LR)</li>
				<li>1 zero register (ZR)</li>
			</ul>
		</li>
		<li>3 “external” components:
			<ul>
				<li>8x8 LED screen</li>
				<li>Terminal</li>
				<li>Keyboard</li>
			</ul>
		</li>
	</ul>

	<h2>Register Descriptions</h2>
	<ul>
		<li><strong>VR (R12)</strong>: Volatile Register for temporary data or 12-bit immediate values.</li>
		<li><strong>SP (R13)</strong>: Stack Pointer, initialize with -1 for top-of-memory stack.</li>
		<li><strong>LR (R14)</strong>: Link Register for next instruction address when branching with link.</li>
		<li><strong>ZR (R15)</strong>: Zero Register, read-only, always returns 0.</li>
	</ul>

	<h2>Instruction Structure</h2>
	<p>Each instruction is 16 bits, with three main structures:</p>
	<ul>
		<li>4-bit opcode, imm12</li>
		<li>4-bit opcode, Rt, imm8</li>
		<li>4-bit opcode, Rt, Rm, Rn</li>
	</ul>
	<p>Registers use 4 bits (total 16 registers).</p>

	<h3>Instruction Types (first 2 bits)</h3>
	<ul>
		<li>00: Arithmetic operation</li>
		<li>01: Store immediate to register or interact with an external component</li>
		<li>10: Branching instruction</li>
		<li>11: Store/load to memory</li>
	</ul>

	<h3>Arithmetic Operation (00)</h3>
	<ul>
		<li>0000 -> signed addition</li>
		<li>0001 -> signed subtraction</li>
		<li>0010 -> signed multiplication</li>
		<li>0011 -> <em>unsigned</em> division</li>
	</ul>

	<h3>Storing Immediate / External Interaction (01)</h3>
	<ul>
		<li>0100 Rt, imm8 -> Store sign-extended 8-bit immediate to register.</li>
		<li>0101 Rt, imm8 -> Shift Rt left by 8 bits and bitwise OR the immediate to it.</li>
		<li>0110 Rt, imm8 -> Interact with components:
			<ul>
				<li>imm8 = 1 => Store keyboard key to Rt (0 if empty buffer).</li>
				<li>imm8 = 2 => Store a random number to Rt.</li>
				<li>imm8 = 4 => Print Rt to terminal (ASCII).</li>
				<li>imm8 = 8 => Flip pixel at Rt on screen (mod 64).</li>
			</ul>
		</li>
		<li>0111 imm12 -> Store 0-extended (unsigned) 12-bit immediate to VR (for const mem addresses).</li>
	</ul>

	<h3>Branching (10)</h3>
	<ul>
		<li>1000 Rt, imm8 -> Branch with signed offset if Rt = 0 (use ZR for unconditional branch)</li>
		<li>1001 Rt, ----, Rm -> Branch to value of Rm if Rt = 0 (use ZR for unconditional branch)</li>
		<li>1010 Rt, imm8 -> Branch with signed offset if Rt > 0 (use ZR for unconditional branch with link)</li>
		<li>1011 Rt, ----, Rm -> Branch to value of Rm if Rt > 0 (use ZR for unconditional branch with link)</li>
	</ul>

	<h3>Store / Load Memory (11)</h3>
	<ul>
		<li>1100 Rt, Rm, Rn -> Load Rt's value from address at Rm + Rn.</li>
		<li>1110 Rt, Rm, Rn -> Store Rt's value to address at Rm + Rn.</li>
	</ul>

	<h1>Language Manual</h1>
	<h2>Assembler Details</h2>
	<p>This language, named <strong>y</strong>, uses a Python (on this site, JS) assembler:</p>
	<code>./ycc [target] [--debug]</code>

	<h3>File Requirements</h3>
	<ul>
		<li>Target files must have a .y extension and output instruction/data files.</li>
		<li>Data files don't generate with empty data or if the segment is all 0.</li>
	</ul>

	<h2>Syntax Overview</h2>
	<h3>Comments and Labels</h3>
	<p>Comments use <code>//</code>, blank lines are also ignored</p>
	<p>Labels are any line ending with a colon EX:</p>
	<code>label:</code>
	<h3>Data Segment</h3>
	<p>The data segment must be at the top of the file, with every line containing an <code>=</code> sign</p>
	<code>num = 20, 30</code>
	<p>There are no directives, so each of these are treated as 16-bit</p>
	<p>Strings store ASCII values sequentially as 16-bit characters.</p>
	<code>str = "Hello, World!\n\0"</code>
	<p>You can also define a chunk of data (filled with 0)</p>
	<code>values = [200]</code>
	<p>And set specific values within them</p>
	<code>values[3] = 50</code>
	<h1>Integer Literals</h1>
	<p>If you put parentheses in place of an integer constant, you can put any valid Python expression that results in a number in its place. For example:</p>
	<pre><code>num = (2 ** 10)</code></pre>
	<p>However, single-quoted strings get replaced with their ASCII value (assuming they contain one character):</p>
	<pre><code>characters = ('\n'), ('a'), ('\0')</code></pre>

	<h2>Aliases</h2>
	<p>This was a quality-of-life feature I added. You can assign additional names to registers within the data segment with the following syntax:</p>
	<pre><code>input := R1</code></pre>
	<p>This makes it so that "input" in the text segment will be interpreted as R1. You can tell this is an alias because it uses <code>:=</code>, and the "source" is a register.</p>

	<h2>Text Segment</h2>
	<p>Every instruction is comprised of two things: the "source" and "destination," separated by <code>&lt;&lt;</code>. It's formatted a bit unconventionally, but here are some examples:</p>
	<pre><code>top:
R2 &lt;&lt; R1 + R0
R5 &lt;&lt; R6 * R7
VR &lt;&lt; R4[R2]  // load mem
R4[R0] &lt;&lt; VR  // store mem
PC &lt;&lt; R6 ?=0 top // branch if R6 = 0
PC &lt;&lt; R7 ?>0 top // branch if R7 > 0
PC@ &lt;&lt; printf // branch with link
PC &lt;&lt; LR       // "return"</code></pre>
	<p>You can tell this is the text segment because <code>&lt;&lt;</code> is used in place of <code>=</code>.</p>
	<p>There exist some "shortcuts" thanks to the zero register:</p>
	<pre><code>PC &lt;&lt; uncondBranch
// Is encoded the same way as
PC &lt;&lt; ZR ?=0 uncondBranch</code></pre>
	<p>Or my personal favorite:</p>
	<pre><code>R4 &lt;&lt; R3
\/
R4 &lt;&lt; ZR + R3</code></pre>
	<p>It's important to note that an immediate can only be used alone; you cannot use them within a larger instruction. For example, the following code is invalid:</p>
	<pre><code>R4 &lt;&lt; R3 + 10</code></pre>
	<p>Instead, you'd have to write it like this:</p>
	<pre><code>VR &lt;&lt; 10
R4 &lt;&lt; R3 + VR</code></pre>

	<h2>Additional Examples</h2>
	<pre><code>num = 10
// Examples of external components in use
R0 &lt;&lt; cin // get key in buffer (0 if empty)
R1 &lt;&lt; rand // get random 16-bit num
cout &lt;&lt; R0 // print R0 to terminal
screen &lt;&lt; R1 // flip R1th pixel

VR &lt;&lt; &num // addresses must go to VR
R10 &lt;&lt; VR[ZR] // ZR provides a convenient offset
R0 &lt;&lt; 9     // set param
PC@ &lt;&lt; proc // dest of PC@ is how you do "BL"
cout &lt;&lt; R10 // printf("\n");
PC &lt;&lt; PC // halt (branches with offset 0)

proc: // prints R0 as a single decimal digit
VR &lt;&lt; ('0')
VR &lt;&lt; VR + R0
cout &lt;&lt; VR
PC &lt;&lt; LR // return</code></pre>
	<h2>Example Program: Snake</h2>
	<img alt="Snake Program" src="/snake.png">
	<p>Snake was my favorite idea for an example program because I knew that with my knowledge it was just barely possible and that it could be a good example of utilizing every component. It's controlled with WASD, using the keyboard, and the apple goes to a random location every time. This implementation is optimized for 1kHz.</p>
	<p>When you die, there's an animation that retracts the snake and then shows a frown if you scored &lt;15 points and a smile if you scored &ge;15 points. Your score also gets printed to the terminal in base 10. On death, you can then press any key to play the game again.</p>

	<h3>Quality-of-Life Features</h3>
	<ul>
		<li>Not allowing you to go backward into yourself.</li>
		<li>Looping around when you hit a wall.</li>
		<li>Giving you an extra "move" when you collect the apple.</li>
	</ul>

	<h3>More Technical Details</h3>
	<p>The game uses two "arrays" of length 64, one of dynamic size used as a ring buffer that stores the positions of each node of the snake, and one that allows for fast checking of if a spot is dangerous or not.</p>
	<p>The snake is modeled as a queue. When it moves to a new spot, it flips the spot at the tail and then flips the new spot at the head, replacing the value where its tail was stored with the new head value. It also updates the collision field as needed.</p>
	<p>Capturing the apple may take more time because the game must shift over a bunch of the snake's values by one. This depends on the time at which you capture the apple. It can be anywhere from 1 move to <em>n</em> moves (where <em>n</em> is the length). On average, you move <em>n</em>/2 elements when collecting the apple. Regular (non-capturing) moves, however, shouldn't take any longer if you're length 1 or length 60.</p>

	<h3>Example Program: Calculator</h3>
	<img alt="Calculator Program" src="/calc.png">
	<p>Enter two base 10 integers, separated by *, for a printed result. (The cpu is 16-bit, so overflow may occur)</p>
</Y84Card>