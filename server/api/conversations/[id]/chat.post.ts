import { z } from "zod";
import { eq, count, sql } from "drizzle-orm";
import { conversations, messages } from "../../../db/drizzle-schema";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { generateConversationTitle } from "../../../utils/generateConversationTitle";
import { schema } from "../../../utils/db";

defineRouteMeta({
  openAPI: {
    tags: ["conversations"],
    description:
      "Send a message to a conversation and get a streaming AI response about company policies",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string" },
            },
            required: ["content"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Streaming AI response about company policies",
        content: {
          "text/plain": {
            schema: {
              type: "string",
            },
          },
        },
      },
      404: {
        description: "Conversation not found",
      },
    },
  },
});

async function getQueryEmbedding(
  query: string,
  openaiApiKey: string
): Promise<number[]> {
  const openai = new (await import("openai")).default({
    apiKey: openaiApiKey,
  });

  const res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  if (!res.data[0]) throw new Error("Failed to generate embedding");

  return res.data[0].embedding;
}

// topK is the number of results to return
async function searchCompanyPolicies(
  query: string,
  openaiApiKey: string,
  topK = 5
) {
  const db = useDb();
  const embedding = await getQueryEmbedding(query, openaiApiKey);

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

  return matches;
}

export default defineApiEventHandler({
  validation: z.object({
    id: z.string().min(1, "ID is required"),
    content: z.string().min(1, "Message content is required"),
  }),
  handler: async (event, { id, content }) => {
    const db = useDb();
    const config = useRuntimeConfig();

    // Convert string ID to number
    const conversationId = parseInt(id);
    if (isNaN(conversationId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid conversation ID",
      });
    }

    // Check if conversation exists
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    // Check if this is the first user message in the conversation
    const [messageCountResult] = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.conversation_id, conversationId));

    const isFirstMessage = messageCountResult?.count === 0;

    // Save user message to database
    await db.insert(messages).values({
      conversation_id: conversationId,
      content,
      role: "user",
    });

    // Search company policies for relevant context
    const relevantPolicies = await searchCompanyPolicies(
      content,
      config.openaiApiKey
    );
    const context = relevantPolicies.map((match) => match.content).join("\n");

    // Start title generation in parallel if this is the first message
    let titleGenerationPromise: Promise<string | null> = Promise.resolve(null);
    if (isFirstMessage) {
      titleGenerationPromise = generateConversationTitle(content)
        .then(async (generatedTitle) => {
          // Update the conversation title in the database
          await db
            .update(conversations)
            .set({ title: generatedTitle })
            .where(eq(conversations.id, conversationId));
          return generatedTitle;
        })
        .catch((error) => {
          console.error("Failed to generate conversation title:", error);
          return null;
        });
    }

    // Update conversation's updated_at timestamp
    await db
      .update(conversations)
      .set({ updated_at: new Date() })
      .where(eq(conversations.id, conversationId));

    // Get conversation history for context
    const conversationHistory = await db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(messages.created_at);

    // Convert to OpenAI message format, excluding the current user message since we'll add it with context
    const messagesForAI = conversationHistory.slice(0, -1).map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // Add system message with company policy context
    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful assistant that answers questions about company policies. 
         You are given a context and a question. You should answer the question based on the context. 
         If you don't know the answer based on the provided context, say 'I don't know' or 'I don't have information about that in our company policies'.
         Only answer questions related to company policies. If the question is not related to company policies, politely redirect the user to ask about company policies.
         
         <context>${context}</context>`,
    };

    // Add the system message and current user message
    messagesForAI.unshift(systemMessage);
    messagesForAI.push({
      role: "user" as const,
      content: content,
    });

    // Set headers for streaming
    setResponseHeaders(event, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    let accumulatedResponse = "";

    // Create OpenAI client with API key
    const openai = createOpenAI({
      apiKey: config.openaiApiKey,
    });

    // Create AI stream
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: messagesForAI,
    });

    // Return the streaming response
    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let titleSent = false;

        try {
          for await (const textDelta of result.textStream) {
            accumulatedResponse += textDelta;
            controller.enqueue(encoder.encode(textDelta));

            // Check if title generation is ready and send it (only once)
            if (!titleSent && isFirstMessage) {
              try {
                const titleResult = await Promise.race([
                  titleGenerationPromise,
                  new Promise<null>((resolve) =>
                    setTimeout(() => resolve(null), 100)
                  ),
                ]);

                if (titleResult) {
                  // Send title update as a special message in the stream
                  const titleUpdate = `\n__TITLE_UPDATE__:${titleResult}__END_TITLE__\n`;
                  controller.enqueue(encoder.encode(titleUpdate));
                  titleSent = true;
                }
              } catch {
                // Silent fail for title generation
              }
            }
          }

          // If title wasn't sent during streaming, try one more time
          if (!titleSent && isFirstMessage) {
            try {
              const titleResult = await titleGenerationPromise;
              if (titleResult) {
                const titleUpdate = `\n__TITLE_UPDATE__:${titleResult}__END_TITLE__\n`;
                controller.enqueue(encoder.encode(titleUpdate));
              }
            } catch {
              // Silent fail for title generation
            }
          }

          // Save the complete AI response to database
          await db.insert(messages).values({
            conversation_id: conversationId,
            content: accumulatedResponse,
            role: "assistant",
          });

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });
  },
});
