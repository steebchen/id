// Analyzing the user's data to understand why sorting is broken

const data = [
	{ id: "00026kqlPADEOW0VPmeB", time: "2026-02-02 16:45:12.496000" },
	{ id: "00026kqlR7xeTYQWQCSC", time: "2026-02-02 16:45:14.295000" },
	{ id: "00026kqlRmlmK0tOIaTe", time: "2026-02-02 16:45:14.898000" },
	{ id: "00026kqlTJW2HANczxEF", time: "2026-02-02 16:45:16.298000" },
	{ id: "00026kqlWF1Qzg71KzOj", time: "2026-02-02 16:45:18.980000" },
	{ id: "00026kqlaGGvXUpsCHkb", time: "2026-02-02 16:45:22.663000" },
	{ id: "00026kqlcJIcz2xYS4G5", time: "2026-02-02 16:45:24.540000" },
	{ id: "00026kqlcgAqDwW1sZW5", time: "2026-02-02 16:45:24.878000" },
];

console.log("Analyzing timestamp encoding in IDs:\n");

// Helper to decode base62 back to numbers (approximate)
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

data.forEach((item) => {
	const timestampPart = item.id.slice(0, 14);
	const randomPart = item.id.slice(14);
	const decodedTimestamp = decodeBase62(timestampPart);
	const msFromTimestamp = Number(decodedTimestamp / 1_000_000n);

	// Extract actual ms from time string
	const actualMs = new Date(item.time.replace(" ", "T") + "Z").getTime();

	console.log(`ID: ${item.id}`);
	console.log(`  Timestamp part: ${timestampPart}`);
	console.log(`  Random part: ${randomPart} (length: ${randomPart.length})`);
	console.log(`  Decoded ms: ${msFromTimestamp}`);
	console.log(`  Actual ms: ${actualMs}`);
	console.log(`  Match: ${msFromTimestamp === actualMs ? "✓" : "✗"}`);
	console.log();
});

// Now sort by ID and see what happens
const sortedByTime = [...data].sort((a, b) => a.time.localeCompare(b.time));
const sortedById = [...data].sort((a, b) => a.id.localeCompare(b.id));

console.log("\n=== Checking if time order matches ID order ===\n");
console.log("Time order:");
sortedByTime.forEach((item, idx) => {
	console.log(`${idx}: ${item.time} -> ${item.id}`);
});

console.log("\nID order:");
sortedById.forEach((item, idx) => {
	console.log(`${idx}: ${item.id} -> ${item.time}`);
});

const matches = sortedByTime.every((item, idx) => item.id === sortedById[idx].id);
console.log(`\nOrder matches: ${matches ? "✓" : "✗"}`);
