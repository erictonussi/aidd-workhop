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
                    id: { type: "string" },
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
  validation: z.object({
    id: z.string().min(1, "ID is required").transform((val) => parseInt(val, 10)),
  }),
  handler: async (event, { id }) => {
    const db = useDb();

    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!existingConversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    await db.delete(conversations).where(eq(conversations.id, id));

    return defineApiResponse(event, {
      data: { id, deleted: true },
      statusMessage: "Conversation deleted successfully",
    });
  },
});