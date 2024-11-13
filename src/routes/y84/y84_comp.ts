const safeFunctionEval = (expression: string) => {
	try {
		// Create a secure context
		const secureFunction = new Function(
			'"use strict";' +
				'var window = undefined;' +
				'var document = undefined;' +
				'var global = undefined;' +
				'var process = undefined;' +
				'var require = undefined;' +
				'var Function = undefined;' +
				'return (' +
				expression +
				');'
		);
		console.log('hey', expression);

		// Execute in a try-catch to handle potential errors
		return secureFunction();
	} catch (error) {
		console.log(error);
		return null;
	}
};

const validateExpression = (expression: string): string => {
	return expression.replaceAll(/'(\\.+?'?|.)'/g, "('$1'.charCodeAt(0))");
};

const safeEval = (expression: string) => {
	console.log('eval1', expression);
	expression = validateExpression(expression);
	console.log('eval', expression);
	return safeFunctionEval(expression);
};

function crunch(inst: number[]): number {
	if (inst.length === 4 && typeof inst[3] === 'number') {
		const [op, dst, r1, r2] = inst;
		return (op << 12) | (dst << 8) | (r1 << 4) | (r2 & 0xf);
	} else if (inst.length === 3) {
		const [op, dst, imm8] = inst;
		return (op << 12) | (dst << 8) | (imm8 & 0xff);
	} else if (inst.length === 2) {
		const [op, imm12] = inst;
		return (op << 12) | (imm12 & 0xfff);
	}
	throw new Error('Invalid instruction format');
}

function getNum(sub: string): number | null {
	if (sub.startsWith('(') && sub.endsWith(')')) {
		// Handle character literals
		try {
			const result = safeEval(sub);
			console.log('result: ', result, sub);
			return typeof result === 'number' ? result : null;
		} catch {
			return null;
		}
	}
	const num = parseInt(sub);
	return isNaN(num) ? null : num;
}

function process(lines: string[]): [Record<string, number[]>, number[], number[]] {
	const labels: Record<string, number> = {};
	const data: Record<string, number[]> = {};
	const toResolve: Record<string, number[]> = {};
	const program: number[][] = [];
	const sourceMap: number[] = [];

	// Initialize registers
	const regs = Object.fromEntries([
		...Array.from(Array(12), (_, i) => [`R${i}`, i]),
		['VR', 12],
		['SP', 13],
		['LR', 14],
		['ZR', 15],
	]);

	let memLoc = 0;
	let dataSeg = true;
	let fileLine = 0;
	for (const rawLine of lines) {
		fileLine++;
		// remove comments
		const line = rawLine.split('//')[0].trim();
		// ignore empty lines
		if (!line) continue;

		if (line.endsWith(':')) {
			const label = line.slice(0, -1).trim();
			if (label in labels) {
				throw new Error(`Duplicate Label: ${label}`);
			}
			labels[label] = program.length;
			if (toResolve[label]) {
				for (const problem of toResolve[label]) {
					program[problem][2] = labels[label] - problem;
				}
				delete toResolve[label];
			}
			continue;
		}

		dataSeg = dataSeg && line.includes('=');
		if (dataSeg) {
			const [dst, src] = line.split('=').map((s) => s.trim());

			if (src in regs) {
				// Handle aliases (:=)
				regs[dst.slice(0, -1).trim()] = regs[src];
			} else if (dst.includes('[')) {
				let [base, offset] = dst.split('[').map((s) => s.trim());
				offset = offset.slice(0, -1).trim();
				let num = getNum(src);
				let offsetNum = getNum(offset);
				if (num == null || offsetNum == null) throw new Error("Invalid number");
				data[base][offsetNum + 1] = num;
			} else {
				const val = [memLoc];
				const intervals = src.split(',');
				let inStr = [];

				for (const interval of intervals) {
					const trimmed = interval.trim();
					if (inStr.length || trimmed.startsWith('"')) {
						inStr.push(interval);
						if (trimmed.endsWith('"')) {
							const lit: string = safeEval(inStr.join(','));
							val.push(...Array.from(lit, (char) => char.charCodeAt(0)));
							inStr = [];
						}
					} else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
						let num = getNum(trimmed.slice(1, -1));
						if (num == null) {
							throw new Error("Invalid length");
						}
						val.push(...Array(num).fill(0));
					} else {
						let num = getNum(trimmed);
						if (num == null) {
							throw new Error("Unrecognized data");
						}
						val.push(num);
					}
				}
				memLoc += val.length - 1;
				data[dst] = val;
			}
		} else {
			// text segment
			const [dst, src] = line.split('<<').map((s) => s.trim());
			const inst = [];

			if (dst === 'PC' || dst === 'PC@') {
				let offset = null;
				let label;
				inst.push(0b1000);

				if (!src.includes('?')) {
					inst.push(0xf);
					inst[0] |= dst === 'PC@' ? 2 : 0;
					label = src;
				} else {
					if (dst === 'PC@') {
						throw new Error('Conditional branch with link');
					}
					const parts = src.split(/\?[>=]0/);
					let cond;
					[cond, label] = parts.map((s) => s.trim());
					inst.push(regs[cond]);
					inst[0] |= src.includes('?>0') ? 2 : 0;
				}

				if (label === 'PC') {
					offset = 0;
				} else if (label in regs) {
					inst[0] |= 1;
					inst.push(regs[label], regs[label]);
				} else {
					offset = label in labels ? labels[label] - program.length : 0;
					if (!(label in labels)) {
						(toResolve[label] = toResolve[label] || []).push(program.length);
					}
				}
				if (offset !== null) {
					inst.push(offset);
				}
			} else if (dst in regs) {
				const dstReg = regs[dst];
				const pot = src.split(/[+\-*/]/);

				if (pot.length === 2 && pot.every((x) => x.trim() in regs)) {
					const [left, right] = pot.map((x) => x.trim());
					const op = '+-*/'.indexOf(src[pot[0].length]);
					inst.push(op, dstReg, regs[left], regs[right]);
				} else if (src in regs) {
					inst.push(0, dstReg, 0xf, regs[src]);
				} else if (src === 'cin' || src === 'rand') {
					inst.push(0b0110, dstReg, src === 'rand' ? 2 : 1);
				} else if (src.startsWith('&')) {
					if (dst !== 'VR') {
						throw new Error('Destination is not VR');
					}
					inst.push(0b0111, data[src.slice(1)][0]);
				} else {
					const imm = getNum(src);
					if (imm !== null) {
						const isVR = dst === 'VR' && imm >= 0 ? 1 : 0;
						if (imm >> (7 + 5 * isVR) !== 0 && imm >> (7 + 5 * isVR) !== -1) {
							throw new Error('Immediate must be split into 2 instructions');
						}
						inst.push(0b0100 + isVR * 0b11);
						if (!isVR) {
							inst.push(dstReg);
						}
						inst.push(imm);
						console.log('inst', inst);
					} else if (src.startsWith('top') || src.startsWith('bot')) {
						const immVal = getNum(src.slice(3).trim());
						if (immVal === null) throw new Error('Invalid immediate value');
						const isTop = src.startsWith('top') ? 1 : 0;
						inst.push(0b0100 | (1 - isTop), dstReg, immVal >> (isTop * 8));
					} else {
						// Handle memory load
						const [base, offsetStr] = src.split('[').map((s) => s.trim());
						console.log(base, offsetStr);
						const offset = offsetStr.slice(0, -1).trim();
						inst.push(0b1110, dstReg, regs[base], regs[offset]);
					}
				}
			} else if (dst === 'cout' || dst === 'screen') {
				inst.push(0b0110, regs[src], 0b100 << (dst === 'screen' ? 1 : 0));
			} else {
				// Handle memory store
				inst.push(0b1100);
				const [base, offsetStr] = dst.split('[').map((s) => s.trim());
				const offset = offsetStr.slice(0, -1).trim();
				inst.push(regs[src], regs[base], regs[offset]);
			}
			sourceMap.push(fileLine);
			program.push(inst);
		}
	}

	if (Object.keys(toResolve).length > 0) {
		throw new Error(`Unresolved label(s): ${Object.keys(toResolve)}`);
	}

	return [data, program.map(crunch), sourceMap];
}

function toFile(lines: number[]): string[] {
	const res = ['v3.0 hex words addressed'];
	let idx = 0;
	const limit = lines.length;

	for (let lineNum = 0; lineNum < 0xffff; lineNum += 16) {
		const toHex = (num: number) => num.toString(16).padStart(4, '0');
		let line = `\n${toHex(lineNum)}:`;

		while (idx < lineNum + 16) {
			line += ' ' + (idx < limit ? toHex(lines[idx]) : '0000');
			idx++;
		}
		res.push(line);
	}
	return res;
}

function processAssembly(sourceCode: string): {
	inst: string[];
	data: string[];
	sourceMap: number[];
} {
	const lines = sourceCode.split('\n');
	const [rawData, rawProgram, sourceMap] = process(lines);

	const inst = toFile(rawProgram);

	console.log("raw", rawData);
	const numericalData = Object.values(rawData)
		.flatMap((val) => val.slice(1))
		.map((num) => num & 0xffff);
	console.log("num", numericalData);

	const data = numericalData.some((x) => x !== 0) ? toFile(numericalData) : [];

	return { inst, data, sourceMap };
}

export { processAssembly };
