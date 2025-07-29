// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateUuid, generateUuidv7 } from "../utils/uuid";

export const posts = sqliteTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUuidv7()),
  title: text("title"),
  content: text("content"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});
