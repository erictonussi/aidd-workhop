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
              title: { type: "string" },
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
                    id: { type: "number" },
                    title: { type: "string" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
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
    id: z.string().min(1, "ID is required"),
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters")
      .optional(),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { id, title }) => {
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

    // Update only provided fields
    const updateData: Partial<typeof conversations.$inferInsert> = {
      updated_at: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    // Update the conversation
    const [updatedConversation] = await db
      .update(conversations)
      .set(updateData)
      .where(eq(conversations.id, conversationId))
      .returning();

    return defineApiResponse(event, {
      data: updatedConversation,
      statusMessage: "Conversation updated successfully",
    });
  },
});
