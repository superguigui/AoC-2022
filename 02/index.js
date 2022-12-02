import fs from 'fs';

const VALUES = { X: 1, Y: 2, Z: 3 };
const STRATEGY1 = {
	A: { X: 0, Y: 1, Z: -1 },
	B: { X: -1, Y: 0, Z: 1 },
	C: { X: 1, Y: -1, Z: 0 },
};

const WINS = { X: 0, Y: 3, Z: 6 };
const STRATEGY2 = {
	A: {
		X: VALUES.Z,
		Y: VALUES.X,
		Z: VALUES.Y,
	},
	B: {
		X: VALUES.X,
		Y: VALUES.Y,
		Z: VALUES.Z,
	},
	C: {
		X: VALUES.Y,
		Y: VALUES.Z,
		Z: VALUES.X,
	},
};

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;

	const input = data.toString(),
		lines = input.split('\n').map((v) => v.split(' '));

	let score1 = 0,
		score2 = 0;

	for (const [them, us] of lines) {
		const win1 = STRATEGY1[them][us];
		score1 += (win1 > 0 ? 6 : win1 < 0 ? 0 : 3) + VALUES[us];
		score2 += WINS[us] + STRATEGY2[them][us];
	}

	console.log({ firstStar: score1, secondStar: score2 });
});
