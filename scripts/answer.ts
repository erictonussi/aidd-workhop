import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";
import { useDb, schema } from "../server/utils/db";
import { sql } from "drizzle-orm";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NUXT_OPENAI_API_KEY!,
});

const db = useDb();

async function getQueryEmbedding(query: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  if (!res.data[0]) throw new Error("Failed to generate embedding");

  return res.data[0].embedding;
}

// topK is the number of results to return
async function searchcompanyPolicies(query: string, topK = 5) {
  const embedding = await getQueryEmbedding(query);

  // Use vector_top_k to find the most similar vectors, then join with the actual table
  // vector_top_k returns records with the primary key/rowid of matching rows
  const matches = await db
    .select({
      id: sql`vt.id`,
      content: schema.companyPolicies.content,
      filepath: schema.companyPolicies.filepath,
      chunkNumber: schema.companyPolicies.chunkNumber,
    })
    .from(
      sql`vector_top_k('company_policies_vector_idx', vector32(${JSON.stringify(
        embedding
      )}), ${topK}) as vt`
    )
    .leftJoin(
      schema.companyPolicies,
      sql`${schema.companyPolicies.id} = vt.id`
    );

  console.log(`\n🔍 Top ${topK} results for: "${query}"\n`);
  for (const [i, match] of matches.entries()) {
    console.log(`--- Result ${i + 1} ---`);
    console.log(`Source: ${match.filepath} (Chunk ${match.chunkNumber})`);
    console.log(`Content: ${match.content?.substring(0, 200)}...`);
    console.log("");
  }
  return matches;
}

function promptForQuery() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("🧠 Enter your question: ", async (query) => {
    const answer = await answerQuery(query);
    console.log(answer);
    rl.close();
  });
}

async function answerQuery(query: string) {
  const matches = await searchcompanyPolicies(query);
  const context = matches.map((match) => match.content).join("\n");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that answers questions about company policies. 
           You are given a context and a question. You should answer the question based on the context. 
           If you don't know the answer, say 'I don't know'.
           <context>${context}</context>`,
      },
      { role: "user", content: query },
    ],
  });
  if (!response.choices[0]) throw new Error("Failed to generate response");
  const answer = response.choices[0].message.content;
  return answer;
}

promptForQuery();
