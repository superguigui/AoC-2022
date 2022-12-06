import fs from 'fs';

const distinct = (s) => new Set(s.split('')).size === s.length;
const solve = (input, size) => {
	for (let i = 0; i < input.length - size; i++)
		if (distinct(input.slice(i, i + size))) return i + size;
};

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString();

	console.log({ firstStar: solve(input, 4), secondStar: solve(input, 14) });
});
