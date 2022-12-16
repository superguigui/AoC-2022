import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString();
	const valves = input.split('\n').map((l) => {
		const [id, p, neighbors] =
			/Valve ([A-Z]+) has .+=([0-9]+);.+valves* ([A-Z, ]*)/gi
				.exec(l)
				?.slice(1, 4);
		return { id, p, neighbors: neighbors.split(', ') };
	});
	const valveMap = new Map();
	for (const valve of valves) {
		valveMap.set(valve.id, valve);
	}

	// For each valve we save it's distance to any other valve
	const findShortesDistancesBFS = (startId, endId) => {
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

	for (const start of valves) {
		const map = new Map();
		for (const end of valves) {
			if (end.id !== start.id) {
				map.set(end.id, findShortesDistancesBFS(start.id, end.id));
			}
		}
		distanceMaps.set(start.id, map);
	}

	const visit = (id, unexplored) => {
		const index = unexplored.indexOf(id);
		if (index > -1) unexplored.splice(index, 1);
		return unexplored;
	};

	const explore = (startId = 'AA', t, ignores = []) => {
		const unexplored = visit(
			startId,
			valves.filter((v) => v.p > 0 && !ignores.includes(v.id)).map((m) => m.id)
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

	const [_, humanPaths] = explore('AA', 26);
	let secondStar = 0;
	let i = 0,
		count = humanPaths.length;

	// Test all pairs of possible human path combined with what the elephant has left to do and keep the highest sum of their scores
	for (const { path, score } of humanPaths) {
		const [elephant] = explore('AA', 26, path.split(','));
		secondStar = Math.max(secondStar, score + elephant);
		console.clear();
		console.log({ firstStar });
		console.log(i + ' / ' + count + ' - ' + secondStar);
		i++;
	}
	console.clear();
	console.log({ firstStar, secondStar });
});
