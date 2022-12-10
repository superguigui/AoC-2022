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
	const keys = [20, 60, 100, 140, 180, 220]; // hardcoded...
	const values = [];
	const pixels = [''];
	const run = () => {
		cycle++;
		const p = cycle % 40;
		pixels[pixels.length - 1] +=
			(p || cycle) >= r && (p || cycle) <= r + 2 ? '#' : '.';
		if (p === 0) pixels.push('');
		if (keys.includes(cycle)) values.push(r * cycle);
	};

	for (const [cmd, n] of lines) {
		run();
		if (cmd === 'noop') continue;
		run();
		r += n;
	}

	const firstStar = values.reduce((sum, v) => (sum += v), 0);
	const secondStar = pixels.join('\n');

	console.log({ firstStar });
	console.log(secondStar);
});
