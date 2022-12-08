import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		grid = input.split('\n').map((l) => l.split('').map((n) => parseInt(n)));
	const nbLines = grid.length,
		nbCols = grid[0].length;

	const view = grid.map((l, y) =>
		l.map((c, x) =>
			y === 0 || y === nbLines - 1 || x === 0 || x === nbCols - 1 ? 2 : 0
		)
	);

	for (let y = 1; y < nbLines - 1; y++) {
		let maxLeft = grid[y][0],
			maxRight = grid[y][nbCols - 1];
		for (let xl = 1, xr = nbCols - 2; xl < nbCols; xl++, xr--) {
			const left = grid[y][xl],
				right = grid[y][xr];
			if (left > maxLeft) {
				view[y][xl] += xl;
				maxLeft = Math.max(maxLeft, left);
			}
			if (right > maxRight) {
				view[y][xr] += xr;
				maxRight = Math.max(maxRight, right);
			}
		}
	}

	for (let x = 1; x < nbCols - 1; x++) {
		let maxTop = grid[0][x],
			maxBottom = grid[nbLines - 1][x];
		for (let yt = 1, yb = nbCols - 2; yt < nbCols; yt++, yb--) {
			const top = grid[yt][x],
				bottom = grid[yb][x];
			if (top > maxTop) {
				view[yt][x] += yt;
				maxTop = Math.max(maxTop, top);
			}
			if (bottom > maxBottom) {
				view[yb][x] += yb;
				maxBottom = Math.max(maxBottom, bottom);
			}
		}
	}

	const firstStar = view.reduce(
		(sum, array) => (sum += array.reduce((l, a) => (l += a > 0 ? 1 : 0), 0)),
		0
	);

	const compute = (x, y) => {
		const v = grid[y][x];
		let right = 0;
		for (let ix = x + 1; ix < nbCols; ix++) {
			right++;
			if (v <= grid[y][ix]) break;
		}
		let left = 0;
		for (let ix = x - 1; ix >= 0; ix--) {
			left++;
			if (v <= grid[y][ix]) break;
		}
		let down = 0;
		for (let iy = y + 1; iy < nbLines; iy++) {
			down++;
			if (v <= grid[iy][x]) break;
		}
		let up = 0;
		for (let iy = y - 1; iy >= 0; iy--) {
			up++;
			if (v <= grid[iy][x]) break;
		}
		return left * right * up * down;
	};

	let secondStar = 0;
	view.forEach((l, y) => {
		l.forEach((v, x) => {
			if (v > 0) secondStar = Math.max(secondStar, compute(x, y));
		});
	});

	console.log({ firstStar, secondStar });
});
