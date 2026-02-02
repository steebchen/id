import { readFileSync } from "fs";

const csv = readFileSync("/tmp/user_data.csv", "utf-8");
const lines = csv.split("\n").slice(1); // Skip header

const rows = lines
	.filter((line) => line.trim())
	.map((line) => {
		const [id, time] = line.split(",");
		return { id, time, ms: new Date(time.replace(" ", "T") + "Z").getTime() };
	})
	.sort((a, b) => a.ms - b.ms);

console.log(`Analyzing ${rows.length} IDs from user's data\n`);

let brokenCount = 0;
const brokenPairs: Array<[number, number]> = [];

for (let i = 0; i < rows.length - 1; i++) {
	const curr = rows[i];
	const next = rows[i + 1];
	const lexCorrect = curr.id < next.id;

	if (!lexCorrect) {
		brokenCount++;
		brokenPairs.push([i, i + 1]);
		console.log(`\n✗ BROKEN PAIR #${brokenCount}:`);
		console.log(`  [${i}]   ${curr.id} (${curr.time})`);
		console.log(`  [${i + 1}] ${next.id} (${next.time})`);

		for (let j = 0; j < Math.min(curr.id.length, next.id.length); j++) {
			if (curr.id[j] !== next.id[j]) {
				const c1 = curr.id[j];
				const c2 = next.id[j];
				console.log(`  First diff at pos ${j}: '${c1}' (${c1.charCodeAt(0)}) vs '${c2}' (${c2.charCodeAt(0)})`);
				console.log(`  '${c1}' < '${c2}' lexicographically: ${c1 < c2}`);
				console.log(`  But needs to be true for time-sortability`);
				break;
			}
		}
	}
}

console.log(`\n\n=== SUMMARY ===`);
console.log(`Total IDs: ${rows.length}`);
console.log(`Total adjacent pairs: ${rows.length - 1}`);
console.log(`Broken pairs: ${brokenCount}`);
console.log(`Time-sortable: ${brokenCount === 0 ? "✓ YES" : "✗ NO"}`);

if (brokenCount > 0) {
	console.log(`\n${brokenCount} pair(s) do NOT sort correctly by lexicographic ID ordering.`);
}
