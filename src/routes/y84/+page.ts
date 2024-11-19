import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const fileGlob = import.meta.glob('$lib/programs/*.y', {
		query: '?raw',
		import: 'default',
		eager: true,
	});

	const files = Object.entries(fileGlob).map(([path, content]) => ({
		name: /^.*\/(.+)\.y$/.exec(path)?.[1]!,
		content: content as string
	})).filter(f => f.name != null);
	return { files };
};
