import { z } from "zod";
import { conversations } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Create a new conversation",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
            },
            required: ["title"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Conversation created successfully",
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
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters"),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { title }) => {
    const db = useDb();

    // Set status code to 201 for creation
    setResponseStatus(event, 201);

    // Create the conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        title,
      })
      .returning();

    return defineApiResponse(event, {
      data: newConversation,
      statusMessage: "Conversation created successfully",
    });
  },
});
