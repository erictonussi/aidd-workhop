import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { conversations, messages } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Get a conversation by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      200: {
        description: "Conversation found",
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
                  type: "object",
                  // TODO: Customize your properties here
                  properties: {
                    id: { type: "string" },
                    someField: { type: "string" },
                    
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
    id: z.string().min(1, "ID is required").transform((val) => parseInt(val, 10)),
  }),
  handler: async (event, { id }) => {
    const db = useDb();

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, id))
      .orderBy(asc(messages.created_at));

    return defineApiResponse(event, {
      data: {
        ...conversation,
        messages: conversationMessages,
      },
      statusMessage: "Conversation retrieved successfully",
    });
  },
});