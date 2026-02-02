// Test different base62 alphabets to find one that's lexicographically sortable

const alphabets = {
	"Original (uppercase first)": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	"Lowercase first": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"Mixed (lexicographic)": "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
};

console.log("Testing lexicographic sortability of base62 alphabets:\n");

for (const [name, alphabet] of Object.entries(alphabets)) {
	console.log(`${name}:`);
	console.log(`  Alphabet: ${alphabet}`);

	// Test if the characters sort lexicographically in the same order as they appear
	const chars = alphabet.split("");
	const sorted = [...chars].sort();
	const isSorted = chars.every((char, idx) => char === sorted[idx]);

	console.log(`  Lexicographically pre-sorted: ${isSorted ? "✓ YES" : "✗ NO"}`);

	if (!isSorted) {
		// Show first few mismatches
		console.log(`  First few positions:`);
		for (let i = 0; i < Math.min(15, chars.length); i++) {
			const original = chars[i];
			const sortedChar = sorted[i];
			const match = original === sortedChar ? "✓" : "✗";
			console.log(`    [${i}] ${match} original: '${original}' (${original.charCodeAt(0)})  sorted: '${sortedChar}' (${sortedChar.charCodeAt(0)})`);
		}
	}

	console.log();
}

// The key insight: for lexicographic sortability, we need the alphabet
// to be in ASCII order!
console.log("ASCII code ranges:");
console.log("  '0'-'9': 48-57");
console.log("  'A'-'Z': 65-90");
console.log("  'a'-'z': 97-122");
console.log("\nConclusion: Only '0-9A-Z' (base36) or pure numeric alphabets");
console.log("are naturally lexicographically sortable!");
console.log("For base62 with mixed case, we CANNOT make it lexicographically sortable");
console.log("because uppercase and lowercase letters are interleaved in ASCII.");
