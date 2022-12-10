import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n').map((l) => {
			const [c, n] = l.split(' ');
			return [c, n && parseInt(n)];
		});

	let r = 1;
	let cycle = 0;
	let firstStar = 0;
	const pixels = [''];
	const run = () => {
		cycle++;
		const p = cycle % 40;
		pixels[pixels.length - 1] +=
			(p || cycle) >= r && (p || cycle) <= r + 2 ? '#' : '.';
		if (p === 0) pixels.push('');
		if (p === 20) firstStar += r * cycle;
	};

	for (const [cmd, n] of lines) {
		run();
		if (cmd === 'noop') continue;
		run();
		r += n;
	}

	const secondStar = pixels.join('\n');

	console.log({ firstStar });
	console.log(secondStar);
});
