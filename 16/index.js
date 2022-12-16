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
			if (current.id === endId) {
				return current.dd;
			}
			for (const neighborId of current.neighbors) {
				if (!visited.includes(neighborId)) {
					visited.push(neighborId);
					const neighbor = { ...valveMap.get(neighborId) };
					neighbor.dd = (current.dd ?? 0) + 1;
					queue.push(neighbor);
				}
			}
		}
	};

	for (const start of valves) {
		const map = new Map();
		for (const end of valves) {
			if (end.id !== start.id) {
				map.set(end.id, findShortesDistancesBFS(start.id, end.id));
			}
		}
		start.distanceTo = map;
	}

	const part1 = (startId = 'AA', t = 30) => {
		const startTime = Date.now();
		let maxP = 0;
		const visit = (id, unexplored) => {
			const index = unexplored.indexOf(id);
			if (index > -1) unexplored.splice(index, 1);
			return unexplored;
		};
		const queue = [
			{
				...valveMap.get(startId),
				t,
				unexplored: visit(
					startId,
					valves.filter((v) => v.p > 0).map((m) => m.id)
				),
			},
		];
		while (queue.length) {
			const current = queue.shift();
			for (const neighborId of Array.from(current.distanceTo.keys())) {
				const dt = current.distanceTo.get(neighborId);
				const unexplored = [...current.unexplored]
				if (unexplored.includes(neighborId) && dt < current.t) {
					const neighbor = { ...valveMap.get(neighborId) };
					if (current.t - dt > 0) {
						neighbor.dd = (current.dd ?? 0) + neighbor.p * (current.t - dt - 1);
						maxP = Math.max(neighbor.dd, maxP);
						queue.push({
							...neighbor,
							t: current.t - dt - 1,
							unexplored: visit(neighborId, unexplored),
						});
					}
				}
			}
		}

		console.log(Date.now() - startTime + 'ms');

		return maxP;
	};

	const firstStar = part1('AA');
	console.log({ firstStar });
});
