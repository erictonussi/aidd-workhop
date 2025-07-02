import { z } from "zod";
import { conversations, messages } from "../db/drizzle-schema";
import { eq } from "drizzle-orm";

defineRouteMeta({
  openAPI: {
    tags: ["chat"],
    description: "Chat with AI assistant (streaming)",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              conversationId: { type: "number", nullable: true },
              message: { type: "string" },
              generateTitle: { type: "boolean", default: false },
            },
            required: ["message"],
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
      400: {
        description: "Invalid input",
      },
      422: {
        description: "Validation error",
      },
    },
  },
});

export default defineApiEventHandler({
  validation: z.object({
    conversationId: z.number().int().optional(),
    message: z.string().min(1, "Message is required"),
    generateTitle: z.boolean().default(false),
  }),
  handler: async (event, { conversationId, message, generateTitle }) => {
    const db = useDb();

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const existingConversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1);

      if (existingConversation.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Conversation not found",
        });
      }
      conversation = existingConversation[0];
    } else {
      // Create new conversation
      const [newConversation] = await db
        .insert(conversations)
        .values({
          title: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      conversation = newConversation;
    }

    // Save user message
    const [_userMessage] = await db
      .insert(messages)
      .values({
        conversationId: conversation.id,
        role: "user",
        content: message,
        createdAt: new Date(),
      })
      .returning();

    // Get conversation history
    const conversationHistory = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id))
      .orderBy(messages.createdAt);

    // Format messages for Anthropic
    const anthropicMessages = conversationHistory
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Set headers for streaming
    setHeader(event, "content-type", "text/plain");
    setHeader(event, "cache-control", "no-cache");
    setHeader(event, "connection", "keep-alive");

    // Create streaming response
    return new ReadableStream({
      async start(controller) {
        try {
          const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
          if (!anthropicApiKey) {
            throw createError({
              statusCode: 500,
              statusMessage: "Anthropic API key not configured",
            });
          }

          // Call Anthropic API with streaming
          const response = await fetch(
            "https://api.anthropic.com/v1/messages",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": anthropicApiKey,
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4096,
                messages: anthropicMessages,
                stream: true,
              }),
            }
          );

          if (!response.ok) {
            throw createError({
              statusCode: response.status,
              statusMessage: `Anthropic API error: ${response.statusText}`,
            });
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw createError({
              statusCode: 500,
              statusMessage: "Failed to read response stream",
            });
          }

          const decoder = new TextDecoder();
          let assistantContent = "";

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);

                if (data === "[DONE]") {
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);

                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.text
                  ) {
                    const text = parsed.delta.text;
                    assistantContent += text;
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch {
                  // Skip invalid JSON
                  continue;
                }
              }
            }
          }

          // Save assistant response
          await db.insert(messages).values({
            conversationId: conversation.id,
            role: "assistant",
            content: assistantContent,
            createdAt: new Date(),
          });

          // Generate title if requested and this is the first exchange
          if (generateTitle && conversationHistory.length === 1) {
            const titlePrompt = `Based on this conversation, generate a short, descriptive title (max 50 characters): "${message}"`;

            try {
              const titleResponse = await fetch(
                "https://api.anthropic.com/v1/messages",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-api-key": anthropicApiKey,
                    "anthropic-version": "2023-06-01",
                  },
                  body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 100,
                    messages: [{ role: "user", content: titlePrompt }],
                  }),
                }
              );

              if (titleResponse.ok) {
                const titleData = await titleResponse.json();
                const title = titleData.content?.[0]?.text?.trim();

                if (title) {
                  await db
                    .update(conversations)
                    .set({
                      title: title.replace(/^["']|["']$/g, ""), // Remove quotes
                      updatedAt: new Date(),
                    })
                    .where(eq(conversations.id, conversation.id));
                }
              }
            } catch (e) {
              // Title generation failed, but that's not critical
              console.warn("Title generation failed:", e);
            }
          }

          // Update conversation timestamp
          await db
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversation.id));

          controller.close();
        } catch (error) {
          console.error("Chat error:", error);
          controller.error(error);
        }
      },
    });
  },
});
