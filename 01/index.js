import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n').map((v) => parseFloat(v)),
		sums = [0];

	for (const line of lines)
		if (isNaN(line)) sums.push(0);
		else sums[sums.length - 1] += line;

	const sorted = sums.sort((a, b) => b - a),
		sumTopThree = sorted.slice(0, 3).reduce((a, b) => a + b, 0);

	console.log({ firstStar: sorted[0], secondStar: sumTopThree });
});
