import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const fileGlob = import.meta.glob('$lib/programs/*_inst', {
		query: '?raw',
		import: 'default',
		eager: true,
	});

	const files = Object.entries(fileGlob).map(([path, content]) => ({
		name: /^.*\/(.+)_inst$/.exec(path)?.[1] as string,
		content: content as string
	})).filter(f => f.name != null);
	return { files };
};
