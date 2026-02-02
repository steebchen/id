// Find a pair from user's data that actually breaks sorting

const data = `00026kqlaGGvXUpsCHkb,2026-02-02 16:45:22.663000
00026kqlbM11MmBRV4e1,2026-02-02 16:45:23.664000
00026kqlc2B47sv0PZJp,2026-02-02 16:45:24.287000
00026kqlcJIcz2xYS4G5,2026-02-02 16:45:24.540000
00026kqlcgAqDwW1sZW5,2026-02-02 16:45:24.878000
00026kqlPADEOW0VPmeB,2026-02-02 16:45:12.496000
00026kqlR7xeTYQWQCSC,2026-02-02 16:45:14.295000`;

const rows = data
	.split("\n")
	.map((line) => {
		const [id, time] = line.split(",");
		return { id, time, ms: new Date(time.replace(" ", "T") + "Z").getTime() };
	})
	.sort((a, b) => a.ms - b.ms); // Sort by time

console.log("Data sorted by time:\n");
rows.forEach((row) => {
	console.log(`${row.id} | ${row.time}`);
});

console.log("\n\nChecking lexicographic ordering:");
for (let i = 0; i < rows.length - 1; i++) {
	const curr = rows[i];
	const next = rows[i + 1];
	const lexCorrect = curr.id < next.id;

	console.log(`\n[${i}] ${curr.id} (${curr.ms})`);
	console.log(`[${i + 1}] ${next.id} (${next.ms})`);
	console.log(`    Lex order correct: ${lexCorrect ? "✓" : "✗ BROKEN"}`);

	if (!lexCorrect) {
		console.log(`    This pair breaks time-sortability!`);

		// Show the first difference
		for (let j = 0; j < Math.min(curr.id.length, next.id.length); j++) {
			if (curr.id[j] !== next.id[j]) {
				console.log(`    First diff at position ${j}: '${curr.id[j]}' vs '${next.id[j]}'`);
				console.log(`    '${curr.id[j]}' < '${next.id[j]}': ${curr.id[j] < next.id[j]}`);
				console.log(`    ASCII: ${curr.id[j].charCodeAt(0)} vs ${next.id[j].charCodeAt(0)}`);
				break;
			}
		}
	}
}
