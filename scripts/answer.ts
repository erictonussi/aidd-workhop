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
  console.log("🔍 Searching for: ", query);
  const embedding = await getQueryEmbedding(query);

  const matches = await db
    .select({
      distance: sql<number>`vector_distance_cos(${
        schema.companyPolicies.embedding
      }, vector32(${JSON.stringify(embedding)}))`,
      content: schema.companyPolicies.content,
      filepath: schema.companyPolicies.filepath,
      chunkNumber: schema.companyPolicies.chunkNumber,
    })
    .from(schema.companyPolicies)
    .orderBy(
      sql`vector_distance_cos(${
        schema.companyPolicies.embedding
      }, vector32(${JSON.stringify(embedding)}))`
    )
    .limit(topK);

  console.log(`\n🔍 Top ${topK} results for: "${query}"\n`);
  for (const [i, match] of matches.entries()) {
    console.log(`--- Result ${i + 1} ---`);
    console.log(match.content);
    console.log(`Source: ${match.filepath} (Chunk ${match.chunkNumber})\n`);
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
