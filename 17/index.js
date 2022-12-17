import fs from 'fs';

fs.readFile('./input.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString();
	const jets = input.split('').map((c) => (c === '>' ? 1 : -1));
	const rockMatrices = {
		'-': [[1, 1, 1, 1]],
		'+': [
			[0, 1, 0],
			[1, 1, 1],
			[0, 1, 0],
		],
		l: [
			[1, 1, 1],
			[0, 0, 1],
			[0, 0, 1],
		],
		'|': [[1], [1], [1], [1]],
		o: [
			[1, 1],
			[1, 1],
		],
	};
	const width = 7;
	const rockOrder = Object.keys(rockMatrices);
	const world = [];
	let currentRock = 0;
	let currentJet = 0;
	let towerHeight = 0;
	let runCount = 0;

	const rest = (rock) => {
		for (let y = 0; y < rock.h; y++)
			for (let x = 0; x < rock.w; x++)
				world[rock.y + y][rock.x + x] =
					world[rock.y + y][rock.x + x] || rock.matrix[y][x];
	};

	const isMoveValid = (rock, dx, dy) => {
		for (let y = 0; y < rock.h; y++)
			for (let x = 0; x < rock.w; x++) {
				if (
					rock.matrix[y][x] &&
					(rock.x + dx + x < 0 ||
						rock.y + dy + y < 0 ||
						rock.x + dx + x >= world[0].length ||
						rock.y + dy + y >= world.length ||
						world[rock.y + dy + y][rock.x + dx + x])
				)
					return false;
			}
		return true;
	};

	const computeTowerHeight = () => {
		for (let i = 0; i < world.length; i++) if (!world[i].includes(1)) return i;
	};

	const tryMove = (i, rock) => {
		let dx = 0,
			dy = 0;
		if (i % 2 === 0) {
			dx = jets[currentJet];
			currentJet = (currentJet + 1) % jets.length;
		} else dy = -1;
		const valid = isMoveValid(rock, dx, dy);
		if (valid) {
			rock.x += dx;
			rock.y += dy;
		}
		return valid || dy === 0;
	};

	const run = () => {
		const rockKey = rockOrder[currentRock];
		const matrix = rockMatrices[rockKey];
		const rock = {
			matrix,
			h: matrix.length,
			w: matrix[0].length,
			x: 2,
			y: towerHeight + 3,
		};

		// expand world
		for (let i = world.length; i < towerHeight + 3 + rock.h; i++)
			world.push(Array(width).fill(0));

		let thisRockSawJetResetHappen = false;

		let i = 0;
		while (1) {
			if (currentJet === 0) {
				thisRockSawJetResetHappen = true;
			}
			if (tryMove(i, rock)) {
				i++;
			} else {
				break;
			}
		}

		rest(rock);
		currentRock = (currentRock + 1) % rockOrder.length;
		towerHeight = computeTowerHeight();
		runCount++;
		return thisRockSawJetResetHappen;
	};

	// Need to make a few rock falls before the pattern can start to emerge
	// If stuck in an infinite loop, try to make this loop run longer (but for part 1 it needs to be 2022)
	for (let i = 0; i < 2022; i++) {
		run();
	}

	const firstStar = towerHeight;

	// Then we make rock fall until the jet loop comes back to 0 (run returns true when that happens)
	while (run()) {}

	// This is the start of our pattern search
	const pattern = {
		jet: currentJet,
		rock: currentRock,
		startHeight: towerHeight,
		startCount: runCount,
		height: undefined,
		size: 0, // number of run needed to complete the pattern
	};

	// The pattern will be found next time we find this jet and rock combination
	let patternFound = false;
	while (!patternFound) {
		run();
		if (pattern.jet === currentJet && pattern.rock === currentRock)
			patternFound = true;
	}

	// Pattern is found ! We can compute it's dimensions
	pattern.height = towerHeight - pattern.startHeight;
	pattern.size = runCount - pattern.startCount;

	const trillion = 1000000000000;
	const nbPatternRepetitions = Math.floor((trillion - runCount) / pattern.size);

	const nbRunLeft =
		trillion - nbPatternRepetitions * pattern.size - pattern.startCount;
	const towerHeightBeforeWeDoTheLastFewRuns = towerHeight;
	for (let i = 0; i < nbRunLeft; i++) run();

	const secondStar =
		pattern.startHeight +
		(towerHeight - towerHeightBeforeWeDoTheLastFewRuns) +
		nbPatternRepetitions * pattern.height;

	console.log({ firstStar, secondStar });
});
