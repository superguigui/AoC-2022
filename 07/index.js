import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n');

	const folders = new Map();
	const increment = (path, size) => folders.set(path, folders.get(path) + size);
	let currentPath = '';

	for (const line of lines) {
		if (line.indexOf('$') === 0) {
			const [_, command, param] = line.split(' ');
			if (command === 'cd') {
				if (param === '..') {
					currentPath = currentPath.replace(/[a-z]+\/$/gi, '');
				} else {
					currentPath += param;
					if (param !== '/') currentPath += '/';

					if (!folders.has(currentPath)) {
						folders.set(currentPath, 0);
					}
				}
			} else if (command === 'ls') {
				folders.get(currentPath);
			}
		} else if (line.indexOf('dir') !== 0) {
			const size = parseInt(line.split(' ')[0]);
			increment(currentPath, size);

			// Don't forget to also increment size of each parent
			let parentPath = currentPath;
			while (parentPath !== '') {
				if (parentPath !== currentPath) {
					increment(parentPath, size);
				}
				parentPath = parentPath.replace(/[a-z]*\/$/gi, '');
			}
		}
	}

	/*
		folders looks like this :

		Map(4) {
			'/' => 48381165,
			'/a/' => 94853,
			'/a/e/' => 584,
			'/d/' => 24933642
		}
	*/

	const sizes = Array.from(folders.values());
	const firstStar = sizes.reduce(
		(sum, size) => (sum += size <= 100000 ? size : 0),
		0
	);

	const target = 30000000 - (70000000 - folders.get('/'));
	const sorted = sizes.sort((a, b) => a - b);
	let i = 0;
	while (sorted[i] < target) i++;
	const secondStar = sorted[i];

	console.log({ firstStar, secondStar });
});
