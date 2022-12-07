import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n');

	const folders = new Map();
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
		} else if (line.indexOf('dir') !== 0)
			folders.set(
				currentPath,
				folders.get(currentPath) + parseInt(line.split(' ')[0])
			);
	}

	/*
		folders looks like this :

		Map(4) {
			'/' => 48381165,
			'/a/' => 94853,
			'/a/e/' => 584,
			'/d/' => 24933642
		}

		But each entry does not include the sum of its subfolder size.
		So let's compute it in inclusiveFolders
	*/
	const inclusiveFolders = new Map();
	folders.forEach((size, path) => {
		let sum = size;
		folders.forEach((size2, path2) => {
			if (path2 !== path && path2.indexOf(path) === 0) sum += size2;
		});
		inclusiveFolders.set(path, sum);
	});

	let firstStar = 0;
	inclusiveFolders.forEach((size) => {
		if (size <= 100000) firstStar += size;
	});

	const target = 30000000 - (70000000 - inclusiveFolders.get('/'));
	const sizes = Array.from(inclusiveFolders.values()).sort((a, b) => a - b);
	let i = 0;
	while (sizes[i] < target) i++;
	const secondStar = sizes[i];
	console.log({ firstStar, secondStar });
});
