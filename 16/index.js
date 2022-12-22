import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString();
	const valveMap = new Map();
	const toRemove = [];
	input.split('\n').forEach((l) => {
		const [id, p, neighbors] =
			/Valve ([A-Z]+) has .+=([0-9]+);.+valves* ([A-Z, ]*)/gi
				.exec(l)
				?.slice(1, 4);

		valveMap.set(id, { id, p, neighbors: neighbors.split(', ') });
		if (p <= 0) toRemove.push(id);
	});

	// For each valve we save it's distance to any other valve
	const shortestRoute = (startId, endId) => {
		const visited = [startId];
		const queue = [valveMap.get(startId)];
		while (queue.length) {
			const current = queue.shift();
			if (current.id === endId) return current.score;
			for (const neighborId of current.neighbors) {
				if (!visited.includes(neighborId)) {
					visited.push(neighborId);
					const neighbor = { ...valveMap.get(neighborId) };
					neighbor.score = (current.score ?? 0) + 1;
					queue.push(neighbor);
				}
			}
		}
	};

	const distanceMaps = new Map();

	valveMap.forEach((start) => {
		const map = new Map();
		valveMap.forEach((end) => {
			if (end.id !== start.id) map.set(end.id, shortestRoute(start.id, end.id));
		});
		distanceMaps.set(start.id, map);
	});

	console.log(valveMap.size);
	toRemove.splice(toRemove.indexOf('AA'), 1);
	valveMap.forEach((v) => {
		toRemove.forEach((t) => {
			const index = v.neighbors.indexOf(t);
			if (index >= 0) {
				v.neighbors.splice(index, 1);
			}
		});
	});
	toRemove.forEach((t) => valveMap.delete(t));
	console.log(valveMap.size);

	const visit = (id, unexplored) => {
		const index = unexplored.indexOf(id);
		if (index > -1) unexplored.splice(index, 1);
		return unexplored;
	};

	const startingValves = Array.from(valveMap.values())
		// .filter((v) => v.p > 0)
		.map((m) => m.id);

	const explore = (startId = 'AA', t, ignores = []) => {
		const unexplored = visit(
			startId,
			startingValves.filter((v) => !ignores.includes(v))
		);
		const all = [];
		const queue = [
			{
				...valveMap.get(startId),
				t,
				unexplored,
				path: [],
			},
		];
		while (queue.length) {
			const current = queue.shift();
			for (const neighborId of Array.from(
				distanceMaps.get(current.id).keys()
			)) {
				const dt = distanceMaps.get(current.id).get(neighborId);
				const unexplored = [...current.unexplored];
				if (unexplored.includes(neighborId) && dt < current.t) {
					const neighbor = { ...valveMap.get(neighborId) };
					if (current.t - dt > 0) {
						neighbor.score =
							(current.score ?? 0) + neighbor.p * (current.t - dt - 1);

						const path = [...current.path, [neighborId, current.t - dt - 1]];
						all.push({
							path: path.map(([id]) => id).join(','),
							score: neighbor.score,
						});
						queue.push({
							...neighbor,
							t: current.t - dt - 1,
							unexplored: visit(neighborId, unexplored),
							path,
						});
					}
				}
			}
		}
		const sorted = all.sort((a, b) => b.score - a.score);
		return [sorted[0]?.score ?? 0, sorted];
	};

	const [firstStar] = explore('AA', 30);

	let [best, humanPaths] = explore('AA', 26);

	// if Human does not close all viable valves in his run we only have to check the rest of them with the elephant I THINK
	// if (humanPaths[0].path.split(',').length < startingValves.length) {
	// 	humanPaths = humanPaths.filter((p) => p.score >= best);
	// 	console.log(humanPaths.length);
	// }

	// Test all pairs of possible human path combined with what the elephant has left to do and keep the highest sum of their scores
	let secondStar = 0;
	let i = 0;
	for (const { path, score } of humanPaths) {
		console.clear();
		console.log(i, '/', humanPaths.length);
		const [elephant] = explore('AA', 26, path.split(','));
		secondStar = Math.max(secondStar, score + elephant);
		i++;
	}
	console.log({ firstStar, secondStar });
});
