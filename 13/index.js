import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString();
	const pairs = input
		.split('\n\n')
		.map((p) => p.split('\n').map((l) => JSON.parse(l)));

	const eqArrays = (a, b) => {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
		return true;
	};

	const compare = (a, b) => {
		const aa = Array.isArray(a);
		const bb = Array.isArray(b);
		if (aa && bb) {
			if (eqArrays(a, b)) return 0;
			if (a.length === 0) return -1;
			if (b.length === 0) return 1;
			const newa = [...a];
			const newb = [...b];
			let c = compare(newa[0], newb[0]);
			while (c === 0) {
				newa.shift();
				newb.shift();
				if (newa.length === 0) return -1;
				if (newb.length === 0) return 1;
				c = compare(newa[0], newb[0]);
			}
			return c;
		} else if (aa && !bb) return compare(a, [b]);
		else if (!aa & bb) return compare([a], b);
		else return a - b;
	};

	const firstStar = pairs.reduce(
		(sum, [a, b], i) => (sum += compare(a, b) ? i + 1 : 0),
		0
	);

	const d2 = [[2]],
		d6 = [[6]],
		sorted = pairs.flat().concat([d2, d6]).sort(compare);
	const secondStar = (sorted.indexOf(d2) + 1) * (sorted.indexOf(d6) + 1);
	console.log({ firstStar, secondStar });
});
