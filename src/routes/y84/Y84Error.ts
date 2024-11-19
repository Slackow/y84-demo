
export default class Y84Error extends Error {
	public lineNumber: number;
	constructor(lineNumber: number, ...args: any) {
		super(...args);
		this.lineNumber = lineNumber;
	}
}