import { z } from "zod";
import { eq } from "drizzle-orm";
import { conversations, messages } from "../../../db/drizzle-schema";

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

    // Set headers for streaming
    setResponseHeaders(event, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Create a dummy AI response
    const aiResponse =
      "I'm a dummy AI response. This is just a placeholder response that will be replaced with real AI integration later. I'm simulating a streaming response by sending this text gradually.";

    let accumulatedResponse = "";

    // Stream the response
    return new ReadableStream({
      async start(controller) {
        const words = aiResponse.split(" ");

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const chunk = i === 0 ? word : " " + word;
          accumulatedResponse += chunk;

          // Send chunk
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(chunk));

          // Add delay to simulate real streaming
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Save the complete AI response to database
        await db.insert(messages).values({
          conversation_id: conversationId,
          content: accumulatedResponse,
          role: "assistant",
        });

        // Close the stream
        controller.close();
      },
    });
  },
});
