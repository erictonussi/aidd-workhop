import {
  sqliteTable,
  text,
  integer,
  customType,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Define the float32 vector type with 1536 dimensions
const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});

// 2. Define the MCP docs table using the custom vector type
export const companyPolicies = sqliteTable("company_policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filepath: text("filepath").notNull(),
  chunkNumber: integer("chunk").notNull(),
  content: text("content").notNull(),
  embedding: float32Array("embedding", { dimensions: 1536 }).notNull(),
});
