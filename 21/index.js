import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString().split('\n');
	const map = new Map();
	input.forEach((s) => {
		const [id, value] = s.split(': ');
		map.set(id, value);
	});

	const solve = (key) => {
		const value = map.get(key);
		if (/^[0-9]+$/gi.test(value)) return parseInt(value);
		let [, left, op, right] = /([a-z0-9]+) ([\+\-\*\/]) ([a-z0-9]+)/gi.exec(
			value
		);
		if (/[a-z]+/gi.test(left)) left = solve(left);
		if (/[a-z]+/gi.test(right)) right = solve(right);
		return eval(left + op + right);
	};

	const solve2 = (key) => {
		if (key === 'humn') return 'y';
		const value = map.get(key);
		if (/^[0-9]+$/gi.test(value)) return value;
		let [, left, op, right] = /([a-z0-9]+) ([\+\-\*\/]) ([a-z0-9]+)/gi.exec(
			value
		);
		if (/[a-z]+/gi.test(left)) left = solve2(left);
		if (key === 'root') return `${left} = ${solve(right)}`;
		if (/[a-z]+/gi.test(right)) right = solve2(right);
		return `(${left} ${op} ${right})`;
	};

	const simplify = (eq) => {
		let res = eq;
		const matches = /\([0-9]+ [\+\-\*\/] [0-9]+\)/gi.exec(res);
		if (matches?.length) for (const m of matches) res = res.replace(m, eval(m));
		if (res.length < eq.length) return simplify(res);
		return res;
	};

	const firstStar = solve('root');
	console.log({ firstStar });

	const secondStar = simplify(solve2('root'));
	console.log({ secondStar }); // pasted in an online equation solver because I'm lazy
});
