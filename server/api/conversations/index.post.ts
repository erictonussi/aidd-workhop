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
            // TODO: Customize your properties here
            properties: {
              someField: { type: "string" },
            },
            required: ["someField"],
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
    title: z.string().min(1, "Title is required").max(255).optional(),
  }),
  handler: async (event, payload) => {
    const db = useDb();

    setResponseStatus(event, 201);

    const now = new Date();
    const [createdConversation] = await db
      .insert(conversations)
      .values({
        title: payload.title ?? "New conversation",
        created_at: now,
        updated_at: now,
      })
      .returning();

    return defineApiResponse(event, {
      data: createdConversation,
      statusMessage: "Conversation created successfully",
    });
  },
});