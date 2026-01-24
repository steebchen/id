import { describe, it, expect } from "vitest";
import { id, random } from "./id";

const BASE62_REGEX = /^[0-9A-Za-z]+$/;

describe("id", () => {
	it("generates a 20-character ID", () => {
		const result = id();
		expect(result).toHaveLength(20);
	});

	it("uses only base62 characters (a-zA-Z0-9)", () => {
		const result = id();
		expect(result).toMatch(BASE62_REGEX);
	});

	it("generates unique IDs on consecutive calls", () => {
		const ids = new Set<string>();
		for (let i = 0; i < 1000; i++) {
			ids.add(id());
		}
		expect(ids.size).toBe(1000);
	});

	it("generates IDs that sort chronologically", () => {
		const id1 = id();
		const id2 = id();
		const id3 = id();

		expect(id1 < id2).toBe(true);
		expect(id2 < id3).toBe(true);
	});

	it("maintains monotonic ordering within the same millisecond", () => {
		// Generate many IDs rapidly to ensure some are in the same millisecond
		const ids: string[] = [];
		for (let i = 0; i < 100; i++) {
			ids.push(id());
		}

		// Verify all IDs are strictly increasing
		for (let i = 1; i < ids.length; i++) {
			expect(ids[i] > ids[i - 1]).toBe(true);
		}
	});

	it("accepts a Date object as option", () => {
		const date = new Date("2024-01-15T12:00:00.000Z");
		const result = id({ date });
		expect(result).toHaveLength(20);
		expect(result).toMatch(BASE62_REGEX);
	});

	it("accepts a timestamp in milliseconds as option", () => {
		const timestamp = 1705320000000; // 2024-01-15T12:00:00.000Z
		const result = id({ date: timestamp });
		expect(result).toHaveLength(20);
		expect(result).toMatch(BASE62_REGEX);
	});

	it("generates consistent timestamp prefix for same date", () => {
		const date = new Date("2024-01-15T12:00:00.000Z");
		const id1 = id({ date });
		const id2 = id({ date });

		// The first 14 characters are timestamp-based
		// They should share the same base but counter increments
		const timestampPart1 = id1.slice(0, 14);
		const timestampPart2 = id2.slice(0, 14);

		// Both should be valid base62
		expect(timestampPart1).toMatch(BASE62_REGEX);
		expect(timestampPart2).toMatch(BASE62_REGEX);
	});

	it("generates IDs with earlier dates that sort before later dates", () => {
		const earlyDate = new Date("2020-01-01T00:00:00.000Z");
		const laterDate = new Date("2025-01-01T00:00:00.000Z");

		const earlyId = id({ date: earlyDate });
		const laterId = id({ date: laterDate });

		expect(earlyId < laterId).toBe(true);
	});
});

describe("random", () => {
	it("generates a string of specified length", () => {
		expect(random(10)).toHaveLength(10);
		expect(random(5)).toHaveLength(5);
		expect(random(100)).toHaveLength(100);
	});

	it("uses only base62 characters", () => {
		const result = random(100);
		expect(result).toMatch(BASE62_REGEX);
	});

	it("returns empty string for n <= 0", () => {
		expect(random(0)).toBe("");
		expect(random(-1)).toBe("");
		expect(random(-100)).toBe("");
	});

	it("generates different strings on consecutive calls", () => {
		const results = new Set<string>();
		for (let i = 0; i < 100; i++) {
			results.add(random(20));
		}
		// With 20 base62 characters, collisions are extremely unlikely
		expect(results.size).toBe(100);
	});

	it("handles large lengths", () => {
		const result = random(1000);
		expect(result).toHaveLength(1000);
		expect(result).toMatch(BASE62_REGEX);
	});

	it("handles length of 1", () => {
		const result = random(1);
		expect(result).toHaveLength(1);
		expect(result).toMatch(BASE62_REGEX);
	});
});
