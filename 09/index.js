import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n').map((l) => {
			const [c, n] = l.split(' ');
			return [c, parseInt(n)];
		});

	const solve = (rope) => {
		const visited = new Set();

		const moveHead = (c) => {
			if (c === 'U') rope[0][1]++;
			else if (c === 'D') rope[0][1]--;
			else if (c === 'L') rope[0][0]--;
			else if (c === 'R') rope[0][0]++;
		};

		const moveTail = () => {
			for (let i = 1; i < rope.length; i++) {
				const [hx, hy] = rope[i - 1];
				const [tx, ty] = rope[i];
				const dx = hx - tx;
				const dy = hy - ty;
				if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return;
				if (dy !== 0) rope[i][1] += dy > 0 ? 1 : -1;
				if (dx !== 0) rope[i][0] += dx > 0 ? 1 : -1;
			}
		};

		for (let i = 0; i < lines.length; i++) {
			const [c, n] = lines[i];
			for (let j = 0; j < n; j++) {
				moveHead(c);
				moveTail();
				visited.add(`${rope[rope.length - 1][0]}-${rope[rope.length - 1][1]}`);
			}
		}

		return visited.size;
	};

	const firstStar = solve([
		[0, 0],
		[0, 0],
	]);
	const secondStar = solve([
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
	]);
	console.log({ firstStar, secondStar });
});
