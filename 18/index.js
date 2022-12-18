import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString(),
		lines = input.split('\n');

	const getNeighbors = (x, y, z) => [
		[x - 1, y, z],
		[x + 1, y, z],
		[x, y - 1, z],
		[x, y + 1, z],
		[x, y, z - 1],
		[x, y, z + 1],
	];
	const cubes = new Set(lines);

	const bounds = [
		[Infinity, -Infinity],
		[Infinity, -Infinity],
		[Infinity, -Infinity],
	];
	for (const [x, y, z] of Array.from(cubes).map((c) =>
		c.split(',').map(Number)
	)) {
		bounds[0][0] = Math.min(x, bounds[0][0]);
		bounds[0][1] = Math.max(x, bounds[0][1]);
		bounds[1][0] = Math.min(y, bounds[1][0]);
		bounds[1][1] = Math.max(y, bounds[1][1]);
		bounds[2][0] = Math.min(z, bounds[2][0]);
		bounds[2][1] = Math.max(z, bounds[2][1]);
	}

	const inBounds = (x, y, z) =>
		x >= bounds[0][0] &&
		x <= bounds[0][1] &&
		y >= bounds[1][0] &&
		y <= bounds[1][1] &&
		z >= bounds[2][0] &&
		z <= bounds[2][1];

	const part1 = (filled) => {
		let nbFaces = filled.size * 6;
		const grid = new Map();
		const gridCheck = (a, b) => grid.get(a)?.has(b) || grid.get(b)?.has(a);
		const gridSet = (a, b) => {
			if (!grid.has(a)) grid.set(a, new Set());
			grid.get(a).add(b);
		};
		for (const cube of Array.from(filled).map((o) =>
			o.split(',').map(Number)
		)) {
			const neighbors = getNeighbors(...cube);
			const cubeId = cube.join(',');
			for (const neighbor of neighbors) {
				const neighborId = neighbor.join(',');
				if (filled.has(neighborId)) {
					if (!gridCheck(cubeId, neighborId)) {
						gridSet(cubeId, neighborId);
						nbFaces -= 2;
					}
				}
			}
		}
		return nbFaces;
	};

	const part2 = () => {
		const stack = [[bounds[0][0] - 1, bounds[1][0], bounds[2][0]]];
		const checked = new Set();
		const water = new Set();

		// Save everywhere water can go (DFS that starts outside bounds and stops at bounds or existing cube)
		while (stack.length) {
			const cube = stack.pop();
			const neighbors = getNeighbors(...cube);
			for (const neighbor of neighbors) {
				const key = neighbor.join(',');
				if (!checked.has(key)) {
					checked.add(key);
					if (inBounds(...neighbor))
						if (!cubes.has(key)) water.add(key), stack.push([...neighbor]);
				}
			}
		}

		const [[minx, maxx], [miny, maxy], [minz, maxz]] = bounds;

		// Fill the holes: check all cubes of boundaries, what's not water is now lava
		const filled = new Set();
		for (let x = minx; x <= maxx; x++)
			for (let y = miny; y <= maxy; y++)
				for (let z = minz; z <= maxz; z++)
					if (!water.has(`${x},${y},${z}`)) {
						filled.add(`${x},${y},${z}`);
					}

		// Count in the same way as in part 1
		return part1(filled);
	};

	console.log({ firstStar: part1(cubes), secondStar: part2() });
});
