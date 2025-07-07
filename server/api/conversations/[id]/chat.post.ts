import { z } from "zod";
import { eq } from "drizzle-orm";
import { conversations, messages } from "../../../db/drizzle-schema";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

defineRouteMeta({
  openAPI: {
    tags: ["conversations"],
    description:
      "Send a message to a conversation and get a streaming AI response",
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
        description: "Streaming AI response",
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

    // Save user message to database
    await db.insert(messages).values({
      conversation_id: conversationId,
      content,
      role: "user",
    });

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

    // Convert to OpenAI message format
    const messagesForAI = conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

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

        try {
          for await (const textDelta of result.textStream) {
            accumulatedResponse += textDelta;
            controller.enqueue(encoder.encode(textDelta));
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
