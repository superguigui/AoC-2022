import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const getDistance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
	const input = data.toString();
	const sensors = input
		.split('\n')
		.map((l) =>
			/.+x=([-0-9]+).+y=([-0-9]+).+x=([-0-9]+).+y=([-0-9]+)/gi
				.exec(l)
				?.slice(1, 5)
				.map((n) => parseInt(n))
		)
		.map((sensor) => [...sensor, getDistance(...sensor)]);

	const part1 = (row) => {
		const forbidden = new Set();
		const setForbiddenSide = (xs, ys, md, advance) => {
			let x = xs,
				dist = Math.abs(ys - row);
			while (dist <= md) forbidden.add(x), (x += advance), dist++;
		};
		for (const [xs, ys, , , d] of sensors) {
			setForbiddenSide(xs, ys, d, 1); // right
			setForbiddenSide(xs, ys, d, -1); // left
		}
		const found = new Set(
			sensors.filter(([, , , y]) => y === row).map(([, , x]) => x)
		);
		return forbidden.size - found.size;
	};

	const isPointInAnotherSensorRadius = (x, y) => {
		for (const [xs, ys, , , d] of sensors)
			if (getDistance(xs, ys, x, y) <= d) return true;
		return false;
	};
	const getSensorParentingPoint = (x, y) => {
		for (const sensor of sensors) {
			const [xs, ys, , , d] = sensor;
			if (getDistance(xs, ys, x, y) <= d) return sensor;
		}
		return;
	};

	const part2BruteForce = (max) => {
		for (
			let mid = Math.floor(max / 2), y1 = 3367717, y2 = mid, y3 = mid + 1, y4 = max;
			y1 <= max;
			y1++, y2--, y3++, y4--
		) {
			console.clear();
			console.log(y1 + ' / ' + max);
			console.log(y2 + ' / ' + max);
			console.log(y3 + ' / ' + max);
			console.log(y4 + ' / ' + max);
			for (const y of [y1, y2, y3, y4]) {
				for (let x = 0; x <= max; x++) {
					const parentSensor = getSensorParentingPoint(x, y);
					// console.log({ x, y }, parentSensor);
					if (parentSensor) {
						if (parentSensor[1] === y) {
							// eliminate a bunch of x at once
							const [xs, , , , d] = parentSensor;
							x = Math.max(x, Math.min(xs + d, max));
						}
					} else {
						return x * 4000000 + y;
					}
				}
			}
		}
	};

	const part2Smart = (max) => {
		for (const [xs, ys, , , d] of sensors)
			for (
				let x = Math.max(0, xs - d - 1), y1 = ys, y2 = ys;
				x <= Math.min(max, xs + d + 1);
				x++,
					y1 = Math.max(0, Math.min(x <= xs ? y1 + 1 : y1 - 1, max)),
					y2 = Math.max(0, Math.min(x <= xs ? y1 - 1 : y1 + 1, max))
			)
				for (const y of [y1, y2])
					if (!isPointInAnotherSensorRadius(x, y)) {
						console.log(x, y);
						return x * 4000000 + y;
					}
	};

	const firsStar = part1(2000000);
	const secondStar = part2Smart(4000000);
	console.log({ firsStar, secondStar });
});
