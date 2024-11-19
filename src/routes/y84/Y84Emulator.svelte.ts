import { processAssembly } from './y84_comp';
import { hexCodeToShorts } from './y84_ops';

const LR = 0xE;
const ZR = 0xF;

const toU16 = (num: number) => num & 65535;
const operations: ((x: number, y: number) => number)[] = [
	(x, y) => x + y,
	(x, y) => x - y,
	(x, y) => x * y,
	(x, y) => toU16(toU16(x) / toU16(y)),
];

export class Y84Emulator {
	private instMem = new Uint16Array(1 << 16);
	private dataMem = new Int16Array(1 << 16);
	private regs = new Int16Array(16);
	private PC = $state(0);

	public isHalted = $state(false);
	public output = (c: number) => {
		this.console += String.fromCharCode(c);
		if (c === 0x000C) {
			this.console = '';
		}
	};

	public console = $state('');

	public source = $state('');
	public sourceMap: number[] = $state([]);

	public screen = $state(Array(64).fill(0));
	private keyboard: number[] = [];

	private nextKey(): number {
		return this.keyboard.shift() ?? 0;
	}

	public pressKey(key: number) {
		console.log('pressed key', key);
		if (!this.isHalted && this.keyboard.length < 100) {
			this.keyboard.push(key);
		}
	}

	public tick(ignoreHalt = false) {
		if (!ignoreHalt && this.isHalted) return;
		const oldPC = this.PC;
		const inst = toU16(this.instMem[this.PC]);
		// console.log(oldPC, inst.toString(2).padStart(16, '0'), [...this.regs])
		switch (inst >> 14) {
			case 0b00: {
				let dstReg = (inst >> 8) & 0xf;
				if (dstReg !== ZR) {
					let leftReg = (inst >> 4) & 0xf;
					let rightReg = inst & 0xf;
					this.regs[dstReg] = operations[(inst >> 12) & 3](this.regs[leftReg], this.regs[rightReg]);
				}
				break;
			}
			case 0b01: {
				let dstReg = (inst >> 8) & 0xf;
				let imm8 = inst & 0xff;
				let regWrite = dstReg !== ZR;
				let value = 0;
				switch ((inst >> 12) & 3) {
					case 0b00: {
						value = (imm8 << 24) >> 24;
						break;
					}
					case 0b01: {
						value = (this.regs[dstReg] << 8) | imm8;
						break;
					}
					case 0b10: {
						switch (imm8) {
							case 1:
								value = this.nextKey();
								break;
							case 2:
								value = Math.floor(Math.random() * (1 << 16));
								break;
							case 4:
								this.output(this.regs[dstReg]);
								regWrite = false;
								break;
							case 8:
								this.screen[this.regs[dstReg] & 63] ^= 1;
								regWrite = false;
								break;
						}
						break;
					}
					case 0b11: {
						dstReg = 0xc;
						value = inst & 0xfff;
						break;
					}
				}
				if (regWrite) {
					this.regs[dstReg] = value;
				}
				break;
			}
			case 0b10: {
				let subOp = (inst >> 12) & 0x3;
				let dstReg = (inst >> 8) & 0xf;
				let imm8 = ((inst & 0xff) << 24) >> 24;
				let newPC = (subOp & 1) === 0 ? this.PC + imm8 : this.regs[inst & 0xf];
				let condition = (subOp & 2) === 0 ? this.regs[dstReg] === 0 : this.regs[dstReg] > 0;
				if (condition || dstReg === ZR) {
					if (!condition) {
						this.regs[LR] = this.PC + 1;
					}
					this.PC = newPC - 1;
				}
				break;
			}
			case 0b11: {
				let address = toU16(this.regs[(inst >> 4) & 0xf] + this.regs[inst & 0xf]);
				let dstReg = (inst >> 8) & 0xf;
				if (((inst >> 13) & 1) == 1) {
					this.regs[dstReg] = this.dataMem[address];
				} else {
					this.dataMem[address] = this.regs[dstReg];
				}
				break;
			}
		}
		this.PC++;
		this.isHalted = this.isHalted || this.PC === oldPC || inst === 0;
	}

	public reset() {
		this.halt();
		this.instMem.fill(0);
		this.dataMem.fill(0);
		this.regs.fill(0);
		this.screen.fill(0);
		// clear terminal
		this.output(0o14);
		this.keyboard = [];
		this.PC = 0;
	}

	public halt() {
		this.isHalted = true;
	}

	public resume() {
		this.isHalted = false;
	}

	public toggleHalt() {
		this.isHalted = !this.isHalted;
	}

	public load(program: Uint16Array, data?: Int16Array, source?: string, sourceMap?: number[]) {
		this.reset();
		this.instMem = program;
		this.dataMem = data ?? new Int16Array(65536);
		this.sourceMap = sourceMap ?? [];
		this.source = source ?? '';
		console.log('Reset');
		this.resume();
	}

	public currentInstruction() {
		return this.instMem[this.PC];
	}

	public async reload() {
		let {inst, data} = await processAssembly(this.source);
		let instH = hexCodeToShorts(inst.join("\n"))?.inst;
		let dataH = hexCodeToShorts(data.join("\n"))?.inst;
		console.log(instH, dataH);
		if (instH == null) return;
		this.load(instH, dataH && new Int16Array(dataH), this.source, this.sourceMap);
	}

	public getRegs() {
		return this.regs;
	}

	public getPC() {
		return this.PC;
	}
}