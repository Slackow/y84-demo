<script>
	import Y84Card from '$lib/components/Y84Card.svelte';
</script>

<Y84Card>
<h1 id="manual">Y84 Manual</h1>
<h2>Specs</h2>
<ul>
	<li>16-bit addressed general purpose memory (each 2 bytes has a unique address)</li>
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
	<li><strong>LR (R14)</strong>: Link Register for next instruction address on branches.</li>
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
<p>Determines if the operation is addition, subtraction, multiplication, or division. Multiplication is signed, and division is unsigned.</p>

<h3>Storing Immediate / External Interaction (01)</h3>
<ul>
	<li>0100 Rt, imm8 -> Store sign-extended 8-bit immediate to register.</li>
	<li>0101 Rt, imm8 -> Shift Rt left by 8 bits and bitwise OR the immediate to it.</li>
	<li>0110 Rt, imm8 -> Interact with components:
		<ul>
			<li>1 = Store keyboard key to Rt (0 if empty buffer).</li>
			<li>2 = Store a random number to Rt.</li>
			<li>4 = Print Rt to terminal (ASCII).</li>
			<li>8 = Flip pixel at Rt on screen (mod 64).</li>
		</ul>
	</li>
	<li>0111 imm12 -> Store 0-extended 12-bit immediate to VR (for const mem addresses).</li>
</ul>

<h3>Branching (10)</h3>
<p>Branches with formats based on <code>Rt</code>, <code>Rm</code>, and immediate values.</p>

<h3>Store / Load Memory (11)</h3>
<ul>
	<li>1100 Rt, Rm, Rn -> Load Rt's value from address at Rm + Rn.</li>
	<li>1110 Rt, Rm, Rn -> Store Rt's value to address at Rm + Rn.</li>
</ul>

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
<p>Comments use <code>//</code>, and labels end with a colon.</p>

<h3>Data Segment</h3>
<p>Define constants and arrays line by line using <code>=</code>. Strings store ASCII values sequentially as 16-bit characters.</p>

<h3>Integer Literals and Aliases</h3>
<p>Numeric literals can be Python expressions in parentheses. Aliases allow register renaming.</p>

<h2>Text Segment</h2>
<p>Each instruction uses <code>&lt;&lt;</code> for assignment:</p>
<pre><code>R2 &lt;&lt; R1 + R0</code></pre>

<h3>Examples</h3>
<pre><code>PC &lt;&lt; R6 ?=0 top
PC@ &lt;&lt; printf
R4 &lt;&lt; VR[ZR]</code></pre>

<h2>Additional Examples</h2>
<h3>Example Program: Snake</h3>
<p>A snake game with keyboard controls (WASD) and a random apple location.</p>

<h3>Example Program: Calculator</h3>
<p>Enter two base 10 integers, separated by *, for a printed result.</p>
</Y84Card>