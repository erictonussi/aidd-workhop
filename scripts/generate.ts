import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { useDb, schema } from "../server/utils/db";
import { sql } from "drizzle-orm";

dotenv.config();
const folder = "company_policies";

const openai = new OpenAI({
  apiKey: process.env.NUXT_OPENAI_API_KEY!,
});

const db = useDb();

await db.run(sql`
  CREATE INDEX IF NOT EXISTS company_policies_vector_idx
  ON company_policies(libsql_vector_idx(embedding));
`);

const directory = path.join(process.cwd(), folder);

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  return files.filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));
}

// Chunking splits large files into smaller parts to fit token limits and improve semantic search.
async function chunkText(text: string, maxTokens = 50): Promise<string[]> {
  // Split by paragraphs (empty lines)
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length > maxTokens * 4) {
      if (current.trim()) chunks.push(current.trim());
      current = "";
    }
    current += para + "\n\n";
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

async function embedAndStore() {
  const files = await getMarkdownFiles(directory);

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const chunks = await chunkText(content);
    console.log(file, chunks.length);

    for (const [i, chunk] of chunks.entries()) {
      const res = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: chunk,
      });

      if (!res.data[0]) throw new Error("Failed to generate embedding");

      const embedding = res.data[0].embedding;

      await db.insert(schema.companyPolicies).values([
        {
          filepath: file,
          content: chunk,
          chunkNumber: i,
          embedding: sql`vector32(${JSON.stringify(embedding)})`,
        },
      ]);
    }

    console.log(`✅ Embedded ${file}`);
  }
}

embedAndStore().catch(console.error);
