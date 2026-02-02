import { randomBytes } from "crypto";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// High-resolution time tracking for sub-millisecond precision
// Uses hrtime.bigint() when available for nanosecond precision within a process
const hasHrtime = typeof process !== "undefined" && typeof process.hrtime?.bigint === "function";
const startHrtime = hasHrtime ? process.hrtime.bigint() : 0n;
const startMs = Date.now();

// Fallback counter for environments without hrtime or when using custom dates
let lastTimestamp = 0n;
let fallbackCounter = 0;

/**
 * Encodes a number or bigint to base62 string
 */
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

/**
 * Encodes a buffer to base62 string
 */
function encodeBufferToBase62(buffer: Buffer): string {
	let result = "";
	for (const byte of buffer) {
		result += BASE62_CHARS[byte % 62];
	}
	return result;
}

export interface IdOptions {
	/**
	 * Optional date to use for ID generation instead of current time
	 * Can be a Date object or a timestamp in milliseconds
	 */
	date?: Date | number;
}

/**
 * Gets a high-precision timestamp combining wall-clock time with sub-millisecond precision.
 * Uses hrtime.bigint() for nanosecond precision when available.
 */
function getHighPrecisionTimestamp(): bigint {
	if (hasHrtime) {
		const hrtimeNow = process.hrtime.bigint();
		const elapsedNs = hrtimeNow - startHrtime;
		const elapsedMs = Number(elapsedNs / 1_000_000n);
		const subMsNs = Number(elapsedNs % 1_000_000n);
		const ms = startMs + elapsedMs;
		return BigInt(ms) * 1_000_000n + BigInt(subMsNs);
	}
	// Fallback: use milliseconds only
	return BigInt(Date.now()) * 1_000_000n;
}

/**
 * Generates a time-sortable unique ID
 * Format: [timestamp in base62][random bytes in base62]
 * - Timestamp with nanosecond precision ensures chronological sorting
 * - Random bytes ensure uniqueness across machines
 * - Output uses only a-zA-Z0-9 characters
 *
 * @param options - Optional configuration object
 * @param options.date - Optional date to use for ID generation (Date object or timestamp in ms)
 * @returns A time-sortable unique ID string
 */
export function id(options?: IdOptions): string {
	let timestamp: bigint;

	if (options?.date) {
		// Use provided date - fall back to counter-based approach since we can't use hrtime
		const ms = options.date instanceof Date ? options.date.getTime() : options.date;
		const baseTimestamp = BigInt(ms) * 1_000_000n;

		// Use counter for custom dates to ensure uniqueness within same millisecond
		if (baseTimestamp === lastTimestamp) {
			fallbackCounter++;
		} else {
			lastTimestamp = baseTimestamp;
			fallbackCounter = 0;
		}
		timestamp = baseTimestamp + BigInt(fallbackCounter % 1_000_000);
	} else {
		// Use high-precision timestamp for current time
		timestamp = getHighPrecisionTimestamp();

		// Ensure monotonicity even if hrtime has quirks
		if (timestamp <= lastTimestamp) {
			lastTimestamp++;
			timestamp = lastTimestamp;
		} else {
			lastTimestamp = timestamp;
		}
	}

	// Encode timestamp to base62 (ensures time-sortability)
	const timestampPart = encodeBase62(timestamp).padStart(14, "0");

	// Generate 6 random bytes for uniqueness
	const randomPart = encodeBufferToBase62(randomBytes(6));

	return timestampPart + randomPart;
}

/**
 * Generates a random string of specified length using base62 characters
 *
 * @param n - The length of the random string to generate
 * @returns A random string of length n using characters a-zA-Z0-9
 */
export function random(n: number): string {
	if (n <= 0) return "";
	const bytes = randomBytes(n);
	return encodeBufferToBase62(bytes).slice(0, n);
}
