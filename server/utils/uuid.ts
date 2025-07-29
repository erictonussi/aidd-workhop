import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

/**
 * Generate a version 4 (random) UUID
 * @returns A random UUID string
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * Generate a version 7 (time-ordered) UUID
 * Compatible with the sqlean uuid7() function behavior
 * @returns A time-ordered UUID string
 */
export function generateUuidv7(): string {
  return uuidv7();
}

/**
 * Validate a UUID string
 * @param uuid The UUID string to validate
 * @returns True if valid UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Extract timestamp from UUID v7
 * @param uuid UUID v7 string
 * @returns Unix timestamp in milliseconds or null if not a valid UUID v7
 */
export function getUuidv7Timestamp(uuid: string): number | null {
  if (!isValidUuid(uuid)) {
    return null;
  }

  // Check if it's a version 7 UUID
  const version = parseInt(uuid.charAt(14), 16);
  if (version !== 7) {
    return null;
  }

  // Extract timestamp from the first 48 bits
  const hex = uuid.replace(/-/g, "");
  const timestampHex = hex.substring(0, 12);
  return parseInt(timestampHex, 16);
}

/**
 * Convert UUID v7 timestamp to Date
 * @param uuid UUID v7 string
 * @returns Date object or null if not a valid UUID v7
 */
export function getUuidv7Date(uuid: string): Date | null {
  const timestamp = getUuidv7Timestamp(uuid);
  return timestamp ? new Date(timestamp) : null;
}
