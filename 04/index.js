import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n'),
		pairs = lines.map((l) =>
			l.split(',').map((p) => p.split('-').map((v) => parseFloat(v)))
		);

	let firstStar = 0,
		secondStar = 0;
	for (const [[amin, amax], [bmin, bmax]] of pairs) {
		if ((bmin >= amin && bmax <= amax) || (amin >= bmin && amax <= bmax))
			firstStar++;
		if (
			(bmin >= amin && bmin <= amax) ||
			(bmax >= amin && bmax <= amax) ||
			(amin >= bmin && amin <= bmax) ||
			(amax >= bmin && amax <= bmax)
		)
			secondStar++;
	}

	console.log({ firstStar, secondStar });
});
