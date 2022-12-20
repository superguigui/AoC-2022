import fs from 'fs';

const mod = (a, n) => ((a % n) + n) % n;
fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString().split('\n').map(Number);

	const mix = (arr, indexes = arr.map((_, i) => i)) => {
		const seq = [...arr];
		for (let i = 0; i < indexes.length; i++) {
			const startIndex = indexes.indexOf(i);
			const value = seq[startIndex];
			let newIndex = mod(startIndex + value, seq.length - 1);
			seq.splice(startIndex, 1);
			seq.splice(newIndex, 0, value);
			indexes.splice(indexes.indexOf(i), 1);
			indexes.splice(newIndex, 0, i);
		}
		return seq;
	};

	const solve = (arr, count = 1) => {
		let seq = [...arr];
		const indexes = seq.map((_, i) => i);
		for (let i = 0; i < count; i++) seq = mix(seq, indexes);
		return (
			seq[(seq.indexOf(0) + 1000) % seq.length] +
			seq[(seq.indexOf(0) + 2000) % seq.length] +
			seq[(seq.indexOf(0) + 3000) % seq.length]
		);
	};

	const firstStar = solve(input, 1);
	const secondStar = solve(
		input.map((v) => v * 811589153),
		10
	);
	console.log({ firstStar, secondStar });
});
