// Deep analysis of why IDs aren't sorting correctly

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Two IDs that sort incorrectly from user's data
const id1 = "00026kqlPADEOW0VPmeB"; // ms: 1770050712496 (earlier)
const id2 = "00026kqlaGGvXUpsCHkb"; // ms: 1770050722663 (later)

console.log("Comparing two IDs that should sort in time order:\n");
console.log(`ID1 (earlier): ${id1}`);
console.log(`ID2 (later):   ${id2}`);
console.log(`\nLexicographic sort: ${id1 < id2 ? "ID1 < ID2 ✓" : "ID1 > ID2 ✗"}`);
console.log(`Expected sort: ID1 < ID2 ✓\n`);

// Compare character by character
console.log("Character-by-character comparison:");
for (let i = 0; i < Math.max(id1.length, id2.length); i++) {
	const c1 = id1[i] || "";
	const c2 = id2[i] || "";
	const code1 = c1.charCodeAt(0);
	const code2 = c2.charCodeAt(0);
	const comparison = c1 === c2 ? "=" : c1 < c2 ? "<" : ">";
	const idx1 = BASE62_CHARS.indexOf(c1);
	const idx2 = BASE62_CHARS.indexOf(c2);

	console.log(
		`  [${i}] '${c1}' ${comparison} '${c2}'  |  ASCII: ${code1} vs ${code2}  |  Base62 idx: ${idx1} vs ${idx2}`,
	);

	if (c1 !== c2) {
		console.log(`      ^ First difference at position ${i}`);
		console.log(`        '${c1}' < '${c2}' lexicographically: ${c1 < c2}`);
		console.log(`        '${c1}' < '${c2}' in base62 value: ${idx1 < idx2}`);
		break;
	}
}
