import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString();
	const monkeys = input.split('\n\n').map((m, id) => {
		const [_, list, op, test, decisionTrue, decisionFalse] = m.split('\n');
		const items = list
			.split(': ')[1]
			.split(', ')
			.map((n) => parseInt(n));
		const divisible = parseInt(test.split('by ')[1]);
		const destinations = [
			parseInt(decisionFalse.split('monkey ')[1]),
			parseInt(decisionTrue.split('monkey ')[1]),
		];
		return {
			id,
			items,
			inspect: new Function('old', `return ${op.split('new = ')[1]}`),
			divisible,
			destinations,
		};
	});

	const solve = (rounds, modifier) => {
		const items = monkeys.map((m) => [...m.items]);
		const counts = items.map(() => 0);
		for (let i = 0; i < rounds; i++) {
			for (const monkey of monkeys) {
				while (items[monkey.id].length) {
					counts[monkey.id]++;
					const item = modifier(monkey.inspect(items[monkey.id].shift()));
					items[
						monkey.destinations[item % monkey.divisible === 0 ? 1 : 0]
					].push(item);
				}
			}
		}
		return counts
			.sort((a, b) => b - a)
			.slice(0, 2)
			.reduce((a, b) => a * b);
	};

	const firstStar = solve(20, (a) => Math.floor(a / 3));

	// Had to look up the modulo trick, I could not find it myself...
	const magicMod = monkeys.map((m) => m.divisible).reduce((a, b) => a * b);
	const secondStar = solve(10000, (a) => a % magicMod);

	console.log({ firstStar, secondStar });
});
