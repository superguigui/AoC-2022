import fs from 'fs';

const padArr = (arr, nbCol) => {
	if (arr[nbCol] === undefined) {
		let c = 0;
		while (c <= nbCol) {
			if (!arr[c]) arr.push([]);
			c++;
		}
	}
};

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n');

	// Parse
	const stacks = [];
	const instructions = [];
	for (const line of lines) {
		if (line[1] !== '1') {
			if (line[0] !== 'm') {
				let col = 0,
					p = 0;
				while (p < line.length - 1) {
					if (line.charAt(p) === '[') {
						padArr(stacks, col);
						stacks[col].push(line.slice(p, p + 3).replace(/\[|\]/gi, ''));
					}
					p += 4;
					col++;
				}
			} else {
				const m = /move (\d+) from (\d+) to (\d+)/gi.exec(line);
				instructions.push([
					parseInt(m[1]),
					parseInt(m[2]) - 1,
					parseInt(m[3]) - 1,
				]);
			}
		}
	}

	// Clone stacks for p2
	const stacks2 = [];
	for (const s of stacks) stacks2.push([...s]);

	// p1
	for (const [count, origin, dest] of instructions) {
		for (let i = 0; i < count; i++) {
			stacks[dest].unshift(stacks[origin].shift());
		}
	}
	const firstStar = stacks.map((s) => s[0]).join('');

	// p2
	for (const [count, origin, dest] of instructions) {
		stacks2[dest] = stacks2[origin].splice(0, count).concat(stacks2[dest]);
	}
	const secondStar = stacks2.map((s) => s[0]).join('');

	console.log({ firstStar, secondStar });
});
