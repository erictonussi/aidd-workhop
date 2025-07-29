import { describe, it, expect } from "vitest";
import {
  generateUuid,
  generateUuidv7,
  isValidUuid,
  getUuidv7Timestamp,
  getUuidv7Date,
} from "./uuid";

describe("UUID Utilities", () => {
  describe("generateUuid", () => {
    it("should generate a valid UUID v4", () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = generateUuid();
      const uuid2 = generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("generateUuidv7", () => {
    it("should generate a valid UUID v7", () => {
      const uuid = generateUuidv7();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("should generate time-ordered UUIDs", () => {
      const uuid1 = generateUuidv7();
      // Small delay to ensure different timestamps
      const uuid2 = generateUuidv7();

      // UUID v7 should be lexicographically sortable by time
      expect(uuid1 < uuid2).toBe(true);
    });
  });

  describe("isValidUuid", () => {
    it("should validate correct UUID formats", () => {
      const validUuid = generateUuid();
      expect(isValidUuid(validUuid)).toBe(true);
    });

    it("should reject invalid UUID formats", () => {
      expect(isValidUuid("invalid")).toBe(false);
      expect(isValidUuid("123e4567-e89b-12d3-a456-42661417400")).toBe(false);
      expect(isValidUuid("")).toBe(false);
    });
  });

  describe("getUuidv7Timestamp", () => {
    it("should extract timestamp from UUID v7", () => {
      const uuid = generateUuidv7();
      const timestamp = getUuidv7Timestamp(uuid);

      expect(timestamp).toBeTypeOf("number");
      expect(timestamp).toBeGreaterThan(0);

      // Should be close to current time (within 1 second)
      const now = Date.now();
      expect(Math.abs(now - timestamp!)).toBeLessThan(1000);
    });

    it("should return null for non-v7 UUIDs", () => {
      const uuidv4 = generateUuid();
      expect(getUuidv7Timestamp(uuidv4)).toBe(null);
    });

    it("should return null for invalid UUIDs", () => {
      expect(getUuidv7Timestamp("invalid")).toBe(null);
    });
  });

  describe("getUuidv7Date", () => {
    it("should convert UUID v7 to Date", () => {
      const uuid = generateUuidv7();
      const date = getUuidv7Date(uuid);

      expect(date).toBeInstanceOf(Date);

      // Should be close to current time
      const now = new Date();
      expect(Math.abs(now.getTime() - date!.getTime())).toBeLessThan(1000);
    });

    it("should return null for invalid UUIDs", () => {
      expect(getUuidv7Date("invalid")).toBe(null);
    });
  });
});
