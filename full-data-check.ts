// Check ALL the user's data
const fullData = `00026kqlaGGvXUpsCHkb,2026-02-02 16:45:22.663000
00026kqlbM11MmBRV4e1,2026-02-02 16:45:23.664000
00026kqlc2B47sv0PZJp,2026-02-02 16:45:24.287000
00026kqlc8THfs5NGylu,2026-02-02 16:45:24.380000
00026kqlc8THftmRMRIw,2026-02-02 16:45:24.380000
00026kqlc99F8CCBHgsE,2026-02-02 16:45:24.390000
00026kqlcg6e4u1uscPv,2026-02-02 16:45:24.877000
00026kqlcgAqDwW1sZW5,2026-02-02 16:45:24.878000
00026kqlcJIcz2xYS4G5,2026-02-02 16:45:24.540000
00026kqlcJIcz3bwu510,2026-02-02 16:45:24.540000
00026kqlPADEOW0VPmeB,2026-02-02 16:45:12.496000
00026kqlR7xeTYQWQCSC,2026-02-02 16:45:14.295000`;

const rows = fullData
	.split("\n")
	.map((line) => {
		const [id, time] = line.split(",");
		return { id, time, ms: new Date(time.replace(" ", "T") + "Z").getTime() };
	})
	.sort((a, b) => a.ms - b.ms);

console.log("Looking for broken pairs in full data:\n");

let brokenCount = 0;
for (let i = 0; i < rows.length - 1; i++) {
	const curr = rows[i];
	const next = rows[i + 1];
	const lexCorrect = curr.id < next.id;

	if (!lexCorrect) {
		brokenCount++;
		console.log(`✗ BROKEN PAIR #${brokenCount}:`);
		console.log(`  [${i}]   ${curr.id} (ms: ${curr.ms})`);
		console.log(`  [${i + 1}] ${next.id} (ms: ${next.ms})`);

		for (let j = 0; j < Math.min(curr.id.length, next.id.length); j++) {
			if (curr.id[j] !== next.id[j]) {
				const c1 = curr.id[j];
				const c2 = next.id[j];
				console.log(`  First diff at pos ${j}: '${c1}' (${c1.charCodeAt(0)}) vs '${c2}' (${c2.charCodeAt(0)})`);
				console.log(`  Lexicographic: '${c1}' < '${c2}' = ${c1 < c2}`);
				console.log(`  But needs: '${c1}' < '${c2}' = true for correct sorting\n`);
				break;
			}
		}
	}
}

if (brokenCount === 0) {
	console.log("✓ No broken pairs found! The IDs are time-sortable.");
}

console.log(`\nTotal pairs checked: ${rows.length - 1}`);
console.log(`Broken pairs: ${brokenCount}`);
