// place files you want to import through the `$lib` alias in this folder.

export function downloadData(blob: Blob, name: string){

	let a = document.createElement('a');

	document.body.append(a);

	a.download = name;

	a.href = URL.createObjectURL(blob);

	a.click();

	a.remove();

}