import { z } from "zod";
import { conversations } from "../../db/drizzle-schema";
import { eq } from "drizzle-orm";

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
                error: { type: "boolean" },
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
    id: z.coerce.number().int().min(1, "Valid conversation ID is required"),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { id }) => {
    const db = useDb();

    // Check if conversation exists
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (conversation.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    // Delete conversation (messages will be deleted automatically due to CASCADE)
    await db.delete(conversations).where(eq(conversations.id, id));

    return defineApiResponse(event, {
      data: { id, deleted: true },
      statusMessage: "Conversation deleted successfully",
    });
  },
});
