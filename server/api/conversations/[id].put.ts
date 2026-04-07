import { z } from "zod";
import { eq } from "drizzle-orm";
import { conversations } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Update a conversation by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            // TODO: Customize your properties here
            properties: {
              someField: { type: "string" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Conversation updated successfully",
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
      422: {
        description: "Validation error",
      },
    },
  },
});

export default defineApiEventHandler({
  validation: z.object({
    id: z.string().min(1, "ID is required").transform((val) => parseInt(val, 10)),
    title: z.string().min(1, "Title is required").max(255),
  }),
  handler: async (event, { id, title }) => {
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

    const [updatedConversation] = await db
      .update(conversations)
      .set({
        title,
        updated_at: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();

    return defineApiResponse(event, {
      data: updatedConversation,
      statusMessage: "Conversation updated successfully",
    });
  },
});