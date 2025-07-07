import { z } from "zod";
import { eq } from "drizzle-orm";
import { conversations } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Delete a conversation by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      200: {
        description: "Conversation deleted successfully",
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
                  properties: {
                    id: { type: "number" },
                    deleted: { type: "boolean" },
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
  // TODO: fill out validation as needed
  validation: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { id }) => {
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
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!existingConversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    // Delete the conversation (this will cascade delete messages due to the foreign key constraint)
    await db.delete(conversations).where(eq(conversations.id, conversationId));

    return defineApiResponse(event, {
      data: { id: conversationId, deleted: true },
      statusMessage: "Conversation deleted successfully",
    });
  },
});
