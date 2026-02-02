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
	.map((line, idx) => {
		const [id, time] = line.split(",");
		const timestampPart = id.slice(0, 14);
		const decodedTimestamp = decodeBase62(timestampPart);
		const ms = Number(decodedTimestamp / 1_000_000n);
		const counter = Number(decodedTimestamp % 1_000_000n);

		return {
			originalIndex: idx,
			id,
			time,
			timestampPart,
			ms,
			counter,
		};
	});

// Don't sort! Keep insertion order
console.log("Checking data in INSERTION order (as provided by user):\n");

// Find the IDs mentioned in user's data that came out of order
const id1 = "00026kqlTUokbgjvpf6r"; // Counter 8
const id2 = "00026kqlTUokbY2yxn51"; // Counter 0

const idx1 = rows.findIndex((r) => r.id === id1);
const idx2 = rows.findIndex((r) => r.id === id2);

console.log(`ID with counter 8: ${id1}`);
console.log(`  Position in CSV: ${idx1}`);
console.log(`  Counter: ${rows[idx1].counter}\n`);

console.log(`ID with counter 0: ${id2}`);
console.log(`  Position in CSV: ${idx2}`);
console.log(`  Counter: ${rows[idx2].counter}\n`);

console.log(`Insertion order: counter 8 comes at position ${idx1}, counter 0 comes at position ${idx2}`);
console.log(`This means counter 8 was inserted BEFORE counter 0 in the database!`);
console.log(`\nThis indicates: IDs were generated from DIFFERENT PROCESSES/MACHINES`);
console.log(`where counters are not synchronized.\n`);

// Check if they sort correctly lexicographically
console.log(`Lexicographic comparison:`);
console.log(`  '${id1}' < '${id2}': ${id1 < id2}`);
console.log(`  Char at pos 13: '${id1[13]}' vs '${id2[13]}'`);
console.log(`  'g' (ASCII ${id1[13].charCodeAt(0)}) < 'Y' (ASCII ${id2[13].charCodeAt(0)}): ${"g" < "Y"}`);
console.log(`  This is WRONG because 'g' should come AFTER 'Y' based on counter values!`);
