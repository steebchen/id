import { randomBytes } from "crypto";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Track last timestamp and counter to ensure monotonic ordering within this process
let lastMs = 0;
let counter = 0;

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
 * Generates a time-sortable unique ID
 * Format: [timestamp in base62][random bytes in base62]
 * - Timestamp (ms + counter) ensures chronological sorting
 * - Random bytes ensure uniqueness across machines
 * - Output uses only a-zA-Z0-9 characters
 *
 * @param options - Optional configuration object
 * @param options.date - Optional date to use for ID generation (Date object or timestamp in ms)
 * @returns A time-sortable unique ID string
 */
export function id(options?: IdOptions): string {
	// Get timestamp in milliseconds
	let ms: number;

	if (options?.date) {
		// Use provided date
		ms = options.date instanceof Date ? options.date.getTime() : options.date;
	} else {
		// Use current time
		ms = Date.now();
	}

	// Monotonic counter within the same millisecond for ordering within this process
	// Across machines, IDs in different milliseconds sort by time (via synchronized clocks)
	// IDs in the same millisecond from different machines have random ordering (acceptable)
	if (ms === lastMs) {
		counter++;
	} else {
		lastMs = ms;
		counter = 0;
	}

	// Combine milliseconds with counter for sub-millisecond ordering
	// Counter is limited to 1,000,000 to fit in the nanosecond portion
	const timestamp = BigInt(ms) * 1_000_000n + BigInt(counter % 1_000_000);

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
