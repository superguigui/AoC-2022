import fs from 'fs';

const abc = 'abcdefghijklmnopqrstuvwxyz';
const score = '0' + abc + abc.toUpperCase();

const sharedChars = (a, b) => [...new Set(a.filter((c) => b.includes(c)))];
const sharedCharGroup = (a, b, c) => {
	for (const d of a) {
		if (b.includes(d) && c.includes(d)) return d;
	}
};

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n'),
		rucks = lines.map((v) => [
			v.slice(0, v.length / 2),
			v.slice(v.length / 2, v.length),
		]);

	const firstStar = rucks.reduce(
		(sum, [a, b]) =>
			sum +
			sharedChars(a.split(''), b.split('')).reduce(
				(sum, e) => (sum += score.indexOf(e)),
				0
			),
		0
	);

	let secondStar = 0;
	for (let i = 0; i < lines.length; i += 3) {
		secondStar += score.indexOf(
			sharedCharGroup(
				lines[i].split(''),
				lines[i + 1].split(''),
				lines[i + 2].split('')
			)
		);
	}

	console.log({ firstStar, secondStar });
});
