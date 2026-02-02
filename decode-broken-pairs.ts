import { readFileSync } from "fs";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function decodeBase62(str: string): bigint {
	let result = 0n;
	for (let i = 0; i < str.length; i++) {
		const char = str[i];
		const value = BASE62_CHARS.indexOf(char);
		if (value === -1) throw new Error(`Invalid base62 char: ${char}`);
		result = result * 62n + BigInt(value);
	}
	return result;
}

const csv = readFileSync("/tmp/user_data.csv", "utf-8");
const lines = csv.split("\n").slice(1);

const rows = lines
	.filter((line) => line.trim())
	.map((line) => {
		const [id, time] = line.split(",");
		const timestampPart = id.slice(0, 14);
		const decodedTimestamp = decodeBase62(timestampPart);
		const ms = Number(decodedTimestamp / 1_000_000n);
		const counter = Number(decodedTimestamp % 1_000_000n);

		return {
			id,
			time,
			timestampPart,
			ms,
			counter,
		};
	})
	.sort((a, b) => a.ms - b.ms || a.counter - b.counter);

// Find the problematic pairs
console.log("Analyzing broken pairs:\n");

const brokenPairs = [
	[22, 23], // 'g' vs 'Y'
	[56, 57], // 'b' vs 'B'
];

brokenPairs.forEach(([i, j]) => {
	const id1 = rows[i];
	const id2 = rows[j];

	console.log(`Pair [${i}, ${j}]:`);
	console.log(`  ID1: ${id1.id}`);
	console.log(`    Timestamp part: ${id1.timestampPart}`);
	console.log(`    MS: ${id1.ms}, Counter: ${id1.counter}`);
	console.log(`    Char at pos 13: '${id1.timestampPart[13]}'`);
	console.log(`  ID2: ${id2.id}`);
	console.log(`    Timestamp part: ${id2.timestampPart}`);
	console.log(`    MS: ${id2.ms}, Counter: ${id2.counter}`);
	console.log(`    Char at pos 13: '${id2.timestampPart[13]}'`);
	console.log(`  Lexicographic order: ${id1.id < id2.id ? "ID1 < ID2" : "ID1 > ID2"}`);
	console.log(`  Expected order: ID1 < ID2`);
	console.log(`  ${id1.id < id2.id ? "✓ CORRECT" : "✗ BROKEN"}\n`);
});

// Show all IDs from a problematic millisecond
const problemMs = 1770050716465;
const sameMs = rows.filter((r) => r.ms === problemMs);

console.log(`\nAll ${sameMs.length} IDs with ms=${problemMs}:\n`);
sameMs.forEach((row) => {
	console.log(`  Counter ${row.counter.toString().padStart(3)}: ${row.id} | pos[13]='${row.timestampPart[13]}'`);
});
