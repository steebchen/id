import { id } from "./src/id";

// Generate IDs at specific millisecond timestamps
const ids: Array<{ id: string; ms: number }> = [];

// Generate some IDs at different times
for (let i = 0; i < 10; i++) {
	const testId = id();
	ids.push({ id: testId, ms: Date.now() });
}

console.log("Generated IDs (in generation order):");
ids.forEach((item, idx) => {
	console.log(`${idx}: ${item.id} (${item.ms})`);
});

console.log("\nSorted by ID (lexicographic):");
const sorted = [...ids].sort((a, b) => a.id.localeCompare(b.id));
sorted.forEach((item, idx) => {
	console.log(`${idx}: ${item.id} (${item.ms})`);
});

console.log("\nChecking if sort order matches generation order:");
const sortOrderMatches = ids.every((item, idx) => item.id === sorted[idx].id);
console.log(sortOrderMatches ? "✓ Sort order MATCHES" : "✗ Sort order DOES NOT MATCH");

// Analyze the structure of IDs
console.log("\n\nAnalyzing ID structure:");
console.log("First ID parts:");
const firstId = ids[0].id;
console.log(`  Full ID: ${firstId} (length: ${firstId.length})`);
console.log(`  Timestamp part (first 14): ${firstId.slice(0, 14)}`);
console.log(`  Random part (last 6): ${firstId.slice(14)}`);
