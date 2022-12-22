import fs from 'fs';

const isNumber = (s) => /^\d+$/g.test(s);
const mod = (a, n) => ((a % n) + n) % n;
const extractInstruction = (instructions) => {
	let newInstructions = instructions;
	let match = /^([0-9]+)/g.exec(instructions);
	if (!match) match = /^([RL]+)/g.exec(instructions);
	if (match) newInstructions = newInstructions.replace(match[0], '');
	return [match[0] ?? undefined, newInstructions];
};
const isWall = ([x, y], m) => m[y]?.[x] === '#';
const isVoid = ([x, y], m) =>
	x < 0 || y < 0 || y >= m.length || x >= m[y].length || m[y]?.[x] === ' ';
const writeDebug = (m, [x, y], f) => {
	m[y] = m[y].split('');
	m[y][x] = f === 0 ? '>' : f === 1 ? 'v' : f === 2 ? '<' : '^';
	m[y] = m[y].join('');
};

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const [m, ins] = data.toString().split('\n\n');

	const part1 = () => {
		const map = m.split('\n');
		const debugMap = m.split('\n');
		let pos = [0, 0];
		let instructions = ins;
		let facing = 0;
		while (map[0].charAt(pos[0]) !== '.') pos[0]++;

		const wrapAdvance = ([x, y]) => {
			let x2 = x;
			let y2 = y;

			const inc = [
				[1, 0],
				[0, 1],
				[-1, 0],
				[0, -1],
			];
			const resets = [
				[0, undefined],
				[undefined, 0],
				[map[y].length - 1, undefined],
				[undefined, map.length - 1],
			];
			for (let i = 0; i < 4; i++) {
				if (i === facing) {
					x2 += inc[i][0];
					y2 += inc[i][1];
					if (isVoid([x2, y2], map)) {
						if (resets[i][0] !== undefined) x2 = resets[i][0];
						if (resets[i][1] !== undefined) y2 = resets[i][1];
						while (map[y2].charAt(x2) !== '.' && map[y2].charAt(x2) !== '#') {
							x2 += inc[i][0];
							y2 += inc[i][1];
						}
					}
					if (isWall([x2, y2], map)) return [x, y];
					return [x2, y2];
				}
			}
		};

		const followInstruction = (instruction) => {
			if (isNumber(instruction)) {
				for (let i = 0; i < parseInt(instruction); i++) {
					pos = wrapAdvance(pos);
					writeDebug(debugMap, pos, facing);
				}
			} else {
				facing = mod(facing + (instruction === 'R' ? 1 : -1), 4);
				writeDebug(debugMap, pos, facing);
			}
		};
		writeDebug(debugMap, pos, facing);
		while (instructions.length) {
			let [i, is] = extractInstruction(instructions);
			instructions = is;
			followInstruction(i);
		}
		return 1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + facing;
	};

	const firstStar = part1();
	console.log({ firstStar });
});
