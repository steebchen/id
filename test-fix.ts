import { id } from "./src/id";

// Generate IDs at specific times to simulate cross-millisecond generation
const testData: Array<{ id: string; ms: number }> = [];

// Simulate IDs generated at different milliseconds
const baseTime = Date.now();
for (let i = 0; i < 20; i++) {
	const testTime = baseTime + i * 100; // 100ms apart
	const testId = id({ date: testTime });
	testData.push({ id: testId, ms: testTime });
}

console.log("Generated test IDs at different times:\n");
testData.forEach((item, idx) => {
	console.log(`${idx}: ${item.id} (ms: ${item.ms})`);
});

// Sort by ID lexicographically
const sortedById = [...testData].sort((a, b) => a.id.localeCompare(b.id));

console.log("\n\nAfter sorting by ID lexicographically:\n");
sortedById.forEach((item, idx) => {
	console.log(`${idx}: ${item.id} (ms: ${item.ms})`);
});

// Check if order is preserved
const orderPreserved = testData.every((item, idx) => item.id === sortedById[idx].id);
console.log(`\n\nTime-sortable: ${orderPreserved ? "✓ YES" : "✗ NO"}`);

// Test with the specific problematic case from user's data
console.log("\n\n=== Testing specific timestamps from user's data ===\n");

const userTimestamps = [
	1770050712496, // 2026-02-02 16:45:12.496
	1770050714295, // 2026-02-02 16:45:14.295
	1770050718980, // 2026-02-02 16:45:18.980
	1770050722663, // 2026-02-02 16:45:22.663
	1770050724540, // 2026-02-02 16:45:24.540
];

const userIds = userTimestamps.map((ms) => ({ id: id({ date: ms }), ms }));

console.log("Generated IDs:");
userIds.forEach((item) => {
	console.log(`${item.id} (ms: ${item.ms})`);
});

const userSorted = [...userIds].sort((a, b) => a.id.localeCompare(b.id));
console.log("\nAfter sorting by ID:");
userSorted.forEach((item) => {
	console.log(`${item.id} (ms: ${item.ms})`);
});

const userOrderPreserved = userIds.every((item, idx) => item.id === userSorted[idx].id);
console.log(`\nTime-sortable: ${userOrderPreserved ? "✓ YES" : "✗ NO"}`);
