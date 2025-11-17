import { randomBytes } from "crypto";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

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
 * Generates a time-sortable ID with nanosecond precision
 * Format: [timestamp in base62][random bytes in base62]
 * - Timestamp ensures chronological sorting
 * - Random bytes ensure uniqueness
 * - Output uses only a-zA-Z0-9 characters
 *
 * @param options - Optional configuration object
 * @param options.date - Optional date to use for ID generation (Date object or timestamp in ms)
 * @returns A time-sortable unique ID string
 */
export function id(options?: IdOptions): string {
	// Get current Unix timestamp with nanosecond precision
	// Date.now() gives milliseconds, process.hrtime() gives nanosecond precision
	let ms: number;

	if (options?.date) {
		// Use provided date
		ms = options.date instanceof Date ? options.date.getTime() : options.date;
	} else {
		// Use current time
		ms = Date.now();
	}

	const ns = process.hrtime.bigint();

	// Combine: milliseconds to nanoseconds + sub-millisecond nanosecond precision
	// We use modulo to get only the sub-millisecond part from hrtime
	const timestamp = BigInt(ms) * 1_000_000n + (ns % 1_000_000n);

	// Encode timestamp to base62 (ensures time-sortability)
	const timestampPart = encodeBase62(timestamp).padStart(14, "0");

	// Generate 6 random bytes for uniqueness
	const randomPart = encodeBufferToBase62(randomBytes(6));

	return timestampPart + randomPart;
}
