import fs from 'fs';

fs.readFile('./test.txt', (err, data) => {
	if (err) throw err;
	const input = data.toString(),
		lines = input.split('\n').map((l) => {
			const [ore, clay, obsidian, geode] =
				/.+ore robot costs ((?:[0-9]+ (?:ore|clay|obsidian)(?: and )?)+).+clay robot costs ((?:[0-9]+ (?:ore|clay|obsidian)(?: and )?)+).+obsidian robot costs ((?:[0-9]+ (?:ore|clay|obsidian)(?: and )?)+).+geode robot costs ((?:[0-9]+ (?:ore|clay|obsidian)(?: and )?)+).+/gi
					.exec(l)
					.slice(1, 5)
					.map((p) => {
						const a = p.split(' and ').map((l) => {
							const [n, c] = l.split(' ');
							return [parseInt(n), c];
						});
						const price = {
							ore: 0,
							clay: 0,
							obsidian: 0,
						};
						a.forEach(([v, k]) => {
							price[k] = v;
						});
						return price;
					});

			return {
				ore,
				clay,
				obsidian,
				geode,
			};
		});

	const canBuy = (blueprint, name, wallet) => {
		const cost = blueprint[name];
		return (
			wallet[0] >= cost.ore &&
			wallet[1] >= cost.clay &&
			wallet[2] >= cost.obsidian
		);
	};

	const buy = (blueprint, name, robots, wallet) => {
		const cost = blueprint[name];
		const w = [...wallet];
		const r = [...robots];
		w[0] -= cost.ore;
		w[1] -= cost.clay;
		w[2] -= cost.obsidian;
		if (name === 'ore') {
			r[0]++;
		} else if (name === 'clay') {
			r[1]++;
		} else if (name === 'obsidian') {
			r[2]++;
		} else if (name === 'geode') {
			r[3]++;
		}
		return [r, w];
	};

	const o = [
		0, 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153,
		171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496,
	];

	const robotRun = (r, w) => {
		for (let i = 0; i < r.length; i++) {
			w[i] += r[i];
		}
	};

	const goals = ['ore', 'clay', 'obsidian', 'geode'];
	const solve = (blueprint, maxt) => {
		const maxOrePrice = Math.max(
			blueprint.ore.ore,
			blueprint.clay.ore,
			blueprint.obsidian.ore,
			blueprint.geode.ore
		);
		const maxClayPrice = Math.max(
			blueprint.ore.clay,
			blueprint.clay.clay,
			blueprint.obsidian.clay,
			blueprint.geode.clay
		);
		const maxObsidianPrice = Math.max(
			blueprint.ore.obsidian,
			blueprint.clay.obsidian,
			blueprint.obsidian.obsidian,
			blueprint.geode.obsidian
		);
		let maxg = 0;
		const bfs = (t, goal, wr, wc, wo, wg, rr, rc, ro, rg) => {
			if (
				(goal === 'ore' && rr >= maxOrePrice) ||
				(goal === 'clay' && rc >= maxClayPrice) ||
				(goal === 'obsidian' && (ro >= maxObsidianPrice || rc === 0)) ||
				(goal === 'geode' && ro === 0) ||
				wg + t * rg + o[t] <= maxg
			) {
				return;
			}

			// if (wg >= 8) console.log({ t, rg, wg });
			while (t) {
				if (goal === 'ore' && wr >= blueprint.ore.ore) {
					for (const g of goals) {
						bfs(
							t - 1,
							g,
							wr - blueprint.ore.ore + rr,
							wc - blueprint.ore.clay + rc,
							wo - blueprint.ore.obsidian + ro,
							wg + rg,
							rr + 1,
							rc,
							ro,
							rg
						);
					}
					return;
				} else if (goal === 'clay' && wr >= blueprint.clay.ore) {
					for (const g of goals) {
						bfs(
							t - 1,
							g,
							wr - blueprint.clay.ore + rr,
							wc - blueprint.clay.clay + rc,
							wo - blueprint.clay.obsidian + ro,
							wg + rg,
							rr,
							rc + 1,
							ro,
							rg
						);
					}
					return;
				} else if (
					goal === 'obsidian' &&
					wr >= blueprint.obsidian.ore &&
					wc >= blueprint.obsidian.clay
				) {
					for (const g of goals) {
						bfs(
							t - 1,
							g,
							wr - blueprint.obsidian.ore + rr,
							wc - blueprint.obsidian.clay + rc,
							wo - blueprint.obsidian.obsidian + ro,
							wg + rg,
							rr,
							rc,
							ro + 1,
							rg
						);
					}
					return;
				} else if (
					goal === 'geode' &&
					wr >= blueprint.geode.ore &&
					wo >= blueprint.geode.obsidian
				) {
					for (const g of goals) {
						bfs(
							t - 1,
							g,
							wr - blueprint.obsidian.ore + rr,
							wc - blueprint.obsidian.clay + rc,
							wo - blueprint.obsidian.obsidian + ro,
							wg + rg,
							rr,
							rc,
							ro,
							rg + 1
						);
					}
					return;
				}
				t = t - 1;
				wr = wr + rr;
				wc = wc + rc;
				wo = wo + ro;
				wg = wg + rg;
			}
			// maxg = Math.max(maxg, wg);
			// if (wg >= 9) {
			// 	console.log({ wg, rg });
			// }
			return wg;
		};

		for (const g of goals) {
			bfs(maxt, g, 0, 0, 0, 0, 1, 0, 0, 0);
		}
		return maxg;
	};

	const bfs = (blueprint, maxt) => {
		const maxOrePrice = Math.max(
			blueprint.ore.ore,
			blueprint.clay.ore,
			blueprint.obsidian.ore,
			blueprint.geode.ore
		);
		const maxClayPrice = Math.max(
			blueprint.ore.clay,
			blueprint.clay.clay,
			blueprint.obsidian.clay,
			blueprint.geode.clay
		);
		const maxObsidianPrice = Math.max(
			blueprint.ore.obsidian,
			blueprint.clay.obsidian,
			blueprint.obsidian.obsidian,
			blueprint.geode.obsidian
		);
		console.log({ maxOrePrice, maxClayPrice, maxObsidianPrice });
		const queue = [
			{
				t: maxt,
				r: [1, 0, 0, 0],
				w: [0, 0, 0, 0],
			},
		];

		let maxGeodes = 0;
		while (queue.length) {
			const current = queue.pop();
			// console.clear();
			// console.log('maxGeodes', maxGeodes);
			// console.log('count', count);
			if (current.t > 0) {
				let pw = [...current.w];
				let pr = [...current.r];
				// if (pw[3] + current.t * pr[3] + o[current.t] <= maxGeodes) continue;
				const t = current.t - 1;

				if (canBuy(blueprint, 'ore', pw) && pw[0] <= maxOrePrice) {
					const [r, w] = buy(blueprint, 'ore', pr, pw);
					robotRun(pr, w);
					if (w[3] + t * r[3] + o[t] <= maxGeodes) continue;
					queue.push({ t, r, w });
				} else if (canBuy(blueprint, 'clay', pw) && pw[1] <= maxClayPrice) {
					const [r, w] = buy(blueprint, 'clay', pr, pw);
					robotRun(pr, w);
					if (w[3] + t * r[3] + o[t] <= maxGeodes) continue;
					queue.push({ t, r, w });
				} else if (
					canBuy(blueprint, 'obsidian', pw) &&
					pw[2] <= maxObsidianPrice
				) {
					const [r, w] = buy(blueprint, 'obsidian', pr, pw);
					robotRun(pr, w);
					if (w[3] + t * r[3] + o[t] <= maxGeodes) continue;
					queue.push({ t, r, w });
				} else if (canBuy(blueprint, 'geode', pw)) {
					const [r, w] = buy(blueprint, 'geode', pr, pw);
					robotRun(pr, w);
					if (w[3] + t * r[3] + o[t] <= maxGeodes) continue;
					queue.push({ t, r, w });
				} else {
					if (pw[3] + t * pr[3] + o[t] <= maxGeodes) continue;
					robotRun(pr, pw);
					queue.push({ t, r: pr, w: pw });
				}
			} else {
				maxGeodes = Math.max(maxGeodes, current.w[3]);
			}
		}
		return maxGeodes;
	};

	const part1 = () => {
		return lines.reduce((sum, line, i) => {
			const res = bfs(line, 24);
			return sum + res * (i + 1);
		}, 0);
	};
	const part2 = () => {
		let max = 1;
		let i = 0;
		for (const line of lines.slice(0, 3)) {
			console.log(i);
			const res = bfs(line, 32);
			console.log(res);
			max *= res;
			i++;
		}
		return max;
	};

	const part1b = () => {
		return lines.reduce((sum, line, i) => {
			const res = solve(line, 24);
			return sum + res * (i + 1);
		}, 0);
	};
	const a = solve(lines[0], 24);
	const b = solve(lines[1], 24);
	console.log({ a, b });

	// const part1Time = Date.now();
	const firstStar = part1();
	const firstStar2 = part1b();
	console.log({ firstStar, firstStar2 });
	// console.log('part 1 time', Date.now() - part1Time, 'ms');
	// const part2Time = Date.now();
	// const secondStar = part2();
	// console.log({ secondStar });
	// console.log('part 2 time', Date.now() - part2Time, 'ms');
});
