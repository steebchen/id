// Trace exactly how counter values are encoded in the timestamp part

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function encodeBase62(num: number | bigint): string {
	if (num === 0 || num === 0n) return BASE62_CHARS[0];

	let result = "";
	let n = typeof num === "bigint" ? num : BigInt(num);

	while (n > 0n) {
		result = BASE62_CHARS[Number(n % 62n)] + result;
		n = n / 62n;
	}
	return result;
}

// Simulate what happens with a fixed millisecond timestamp
const ms = 1770050716465; // One of the problematic timestamps
const MS_IN_NANO = 1_000_000n;

console.log("Simulating counter increments at same millisecond:\n");

// Show first few and then the problematic ones
const testCounters = [0, 1, 2, 35, 36, 37, 38, 61, 62, 63, 100, 200, 300];

testCounters.forEach((counter) => {
	const timestamp = BigInt(ms) * MS_IN_NANO + BigInt(counter);
	const encoded = encodeBase62(timestamp).padStart(14, "0");

	// Get the character at position 13 (0-indexed)
	const char13 = encoded[13];
	const charCode = char13.charCodeAt(0);
	const base62Index = BASE62_CHARS.indexOf(char13);

	console.log(
		`Counter ${counter.toString().padStart(3)}: encoded=${encoded} | pos[13]='${char13}' (ASCII ${charCode}, base62 idx ${base62Index})`,
	);
});

console.log("\n\nThe problem: position 13 can have ANY base62 character");
console.log("depending on the counter value. When sorting lexicographically:");
console.log("  Uppercase letters (ASCII 65-90) sort BEFORE lowercase (97-122)");
console.log("  But in base62, lowercase 'a' (index 36) comes AFTER uppercase 'Z' (index 35)");
console.log("\nSo when counter increments cause position 13 to go from lowercase to uppercase,");
console.log("the lexicographic order BREAKS!");
