type Divided = {
	opCode: number;
	Rt?: number;
	imm12?: number;
	imm8?: number;
	Rm?: number;
	Rn?: number;
	blank?: number;
};

export function divide(instruction: number): Divided {
	let opCode = instruction >> 12;
	let subOp = opCode >> 2;
	let Rt = (instruction >> 8) & 0xf;
	let Rm = (instruction >> 4) & 0xf;
	let Rn = (instruction >> 0) & 0xf;
	let imm12 = (instruction >> 0) & 0xfff;
	let imm8 = (instruction >> 0) & 0xff;
	switch (subOp) {
		case 0b01:
			return opCode === 0b0111 ? { opCode, imm12 } : { opCode, Rt, imm8 };
		case 0b10:
			return (opCode & 1) === 0 ? { opCode, Rt, imm8 } : { opCode, Rt, blank: Rm, Rm: Rn };
		default:
			return { opCode, Rt, Rm, Rn };
	}
}

function objMap(obj: any, func: (k: string, v: any) => any): object {
	let result: any = {};
	for (const key in obj) {
		result[key] = func(key, obj[key]);
	}
	return result;
}

export function getMessage(instruction: number): string {
	let divided = objMap(divide(instruction), (k, v) => (k.startsWith('R') ? getRegisterName(v) : v));
	return JSON.stringify(divided);
}

export const registerNames = [
	...Array.from({ length: 12 }, (_, i) => `R${i}`),
	'VR',
	'SP',
	'LR',
	'ZR',
];

export function getRegisterName(register: number): string {
	return registerNames[register];
}

export function getTextInstruction(instruction: number): string {
	let { opCode, Rt, Rm, Rn, imm8, imm12 } = divide(instruction);
	let subOp = opCode >> 2;
	let left, right;
	if (subOp === 0b00) {
		// arithmetic
		left = getRegisterName(Rt!);
		right = `${getRegisterName(Rm!)} ${'+-*/'[opCode & 3]} ${getRegisterName(Rn!)}`;
	} else if (subOp === 0b01) {
		left = getRegisterName(Rt ?? 12);
		right = imm12 ?? ((imm8! + 128) % 256 - 128);
		if ((opCode & 3) === 0b01) {
			right = `bot(${right & 255}) // lshift by 8 and add ${right & 255}`;
		} else if ((opCode & 3) === 0b10) {
      switch (imm8) {
        case 1:
          right = `cin // stores key press into ${left}, 0 if no key in buffer`;
          break;
        case 2:
          right = `rand // stores a random 16-bit int into ${left}`;
          break;
        case 4:
          right = `${left} // outputs ${left} as an ascii character to the terminal`;
          left = "cout";
          break;
        case 8:
          right = `${left} // flips pixel at ${left} % 64`;
          left = "screen";
          break;
        default:
          left = "// Undefined Behavior";
          right = "Try an immediate of 1,2,4, or 8";
      }
    }
	} else if (subOp === 0b10) {
		// branching
		left = (opCode & 2) !== 0 && Rt === 0xf ? 'PC@' : 'PC';
		if ((opCode & 1) === 1) {
			// branches to register value
			right = getRegisterName(Rm!);
		} else {
			// branches with offset
			right = imm8 === 0 ? 'PC // Halt' : `label // ${imm8! > 0 ? `+${imm8}` : `${imm8}`}`;
		}
		if (Rt !== 0xf) {
			right = `${getRegisterName(Rt!)} ?${'= >'[opCode & 2]}0 ${right}`;
		}
	} else {
		// memory
		left = getRegisterName(Rt!);
		right = `${getRegisterName(Rm!)}[${getRegisterName(Rn!)}]`;
		if ((opCode & 2) === 0) [left, right] = [right, left];
	}
	return `${left} << ${right}`;
}

export function hexCodeToShorts(programCode: string): {inst: Uint16Array} | undefined {
	let [firstLine, ...lines] = programCode.split('\n');
	console.log(firstLine);
	if (firstLine !== 'v3.0 hex words addressed') return;
	let inst = new Uint16Array(65536);
	lines.forEach(line => {
		let [baseHex, ...hexes] = line.split(' ');
		let base = parseInt(baseHex, 16);
		hexes.forEach((hex, i) => inst[base + i] = parseInt(hex, 16));
	});
	return {inst};
}
