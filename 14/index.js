import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString();

	let abyss = 0;
	const rocks = input.split('\n').map((l) =>
		l.split(' -> ').map((c) => {
			const p = c.split(',').map((n) => parseInt(n));
			abyss = Math.max(p[1], abyss);
			return p;
		})
	);
	abyss += 2;
	const origin = [500, 0];

	const createGrid = () => {
		const grid = new Map();
		for (const rock of rocks) {
			for (let i = 0; i < rock.length - 1; i++) {
				const [x1, y1] = rock[i],
					[x2, y2] = rock[i + 1];
				for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
					for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
						if (!grid.has(y)) grid.set(y, new Set());
						grid.get(y).add(x);
					}
				}
			}
		}
		return grid;
	};

	const fall = (grid, tester, exiter) => {
		let [x, y] = [...origin]; // start
		while (!exiter([x, y])) {
			if (!tester([x, y + 1])) y++; // down
			else if (!tester([x - 1, y + 1])) x--, y++; // down left
			else if (!tester([x + 1, y + 1])) x++, y++; // down right
			else {
				if (!grid.has(y)) grid.set(y, new Set());
				grid.get(y).add(x);
				return true;
			}
		}
		return false;
	};

	const solve = (tester, exiter) => {
		const grid = createGrid();
		let count = 0;
		while (
			fall(
				grid,
				(p) => tester(p, grid),
				(p) => exiter(p, grid)
			)
		)
			count++;
		return count;
	};

	const firstStar = solve(
		([x, y], grid) => grid.get(y)?.has(x),
		([, y]) => y > abyss
	);
	const secondStar = solve(
		([x, y], grid) => grid.get(y)?.has(x) || y >= abyss,
		(_, grid) => grid.get(origin[1])?.has(origin[0])
	);
	console.log({ firstStar, secondStar });
});
