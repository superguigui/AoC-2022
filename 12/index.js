import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const start = { x: 0, y: 0 };
	const end = { x: 0, y: 0 };
	const starts = [];
	const input = data.toString();
	const grid = input.split('\n').map((l, y) =>
		l.split('').map((c, x) => {
			if (c === 'S') (c = 'a'), (start.x = x), (start.y = y);
			else if (c === 'E') (c = 'z'), (end.x = x), (end.y = y);
			if (c === 'a') starts.push({ x, y });
			return c;
		})
	);
	const visit = ({ x, y }, history) => (history[y][x] = 1);
	const isVisited = ({ x, y }, history) => history[y][x] === 1;
	const isGoal = ({ x, y }) => x === end.x && y === end.y;
	const getValue = ({ x, y }) => grid[y][x].toUpperCase().charCodeAt(0) - 65;
	const getEdges = ({ x, y }) => {
		const edges = [];
		if (y > 0) edges.push({ x, y: y - 1 });
		if (x < grid[y].length - 1) edges.push({ x: x + 1, y });
		if (y < grid.length - 1) edges.push({ x, y: y + 1 });
		if (x > 0) edges.push({ x: x - 1, y });
		return edges;
	};

	const solve = (s) => {
		const history = grid.map((l) => l.map(() => 0));
		visit(s, history);
		const queue = [s];
		while (queue.length) {
			const current = queue.shift();
			const currentValue = getValue(current);
			if (isGoal(current)) {
				let r = current;
				let count = 0;
				while (r?.parent !== undefined) {
					count++;
					r = r.parent;
				}
				return count;
			}
			for (const next of getEdges(current)) {
				const nextValue = getValue(next);
				if (!isVisited(next, history) && nextValue - currentValue <= 1) {
					visit(next, history);
					next.parent = current;
					queue.push(next);
				}
			}
		}
	};

	const firstStar = solve(start);
	const secondStar = starts
		.map((s) => solve(s))
		.filter((z) => z !== 0)
		.sort((a, b) => a - b)[0];

	console.log({ firstStar, secondStar });
});
