import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n').map((l) => l.split(' '));

	let r = 1,
		cycle = 0,
		firstStar = 0,
		secondStar = '';

	const run = () => {
		cycle++;
		const p = cycle % 40;
		secondStar += (p || cycle) >= r && (p || cycle) <= r + 2 ? '#' : '.';
		if (p === 0) secondStar += '\n';
		else if (p === 20) firstStar += r * cycle;
	};

	for (const [cmd, n] of lines) {
		run();
		if (cmd === 'noop') continue;
		run();
		r += parseInt(n);
	}

	console.log({ firstStar });
	console.log(secondStar);
});
