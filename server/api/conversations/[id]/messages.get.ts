import { z } from "zod";
import { eq, count } from "drizzle-orm";
import { conversations, messages } from "../../../db/drizzle-schema";

defineRouteMeta({
  openAPI: {
    tags: ["conversations"],
    description: "Get all messages for a specific conversation",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
      {
        in: "query",
        name: "page",
        required: false,
        schema: { type: "number", default: 1 },
      },
      {
        in: "query",
        name: "limit",
        required: false,
        schema: { type: "number", default: 50 },
      },
    ],
    responses: {
      200: {
        description: "List of messages for the conversation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "boolean", const: false },
                url: { type: "string" },
                statusMessage: { type: "string" },
                statusCode: { type: "number" },
                message: { type: "string" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      conversation_id: { type: "number" },
                      content: { type: "string" },
                      role: {
                        type: "string",
                        enum: ["user", "assistant", "system"],
                      },
                      created_at: { type: "string", format: "date-time" },
                    },
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "number" },
                    limit: { type: "number" },
                    total: { type: "number" },
                    currentPageUrl: { type: "string" },
                    firstPageUrl: { type: "string" },
                    lastPageUrl: { type: "string" },
                    nextPageUrl: { type: "string", nullable: true },
                    prevPageUrl: { type: "string", nullable: true },
                  },
                },
              },
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
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
  handler: async (event, { id, page, limit }) => {
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

    // Get total count of messages for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.conversation_id, conversationId));

    const total = totalResult.count;

    // Get paginated messages ordered by creation time (oldest first for chat)
    const offset = (page - 1) * limit;
    const messagesData = await db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(messages.created_at)
      .limit(limit)
      .offset(offset);

    return definePaginatedApiResponse(event, {
      data: messagesData,
      statusMessage: "Messages retrieved successfully",
      pagination: {
        page,
        limit,
        total,
      },
    });
  },
});
