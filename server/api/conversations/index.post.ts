import { z } from "zod";
import {
  conversations,
  conversationParticipants,
} from "../../db/drizzle-schema";

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
              title: { type: "string", nullable: true },
              type: { type: "string", enum: ["direct", "group"] },
              description: { type: "string", nullable: true },
              createdBy: { type: "number" },
              participantIds: {
                type: "array",
                items: { type: "number" },
                description: "Array of user IDs to add as participants",
              },
            },
            required: ["type", "createdBy", "participantIds"],
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
                error: { type: "boolean" },
                url: { type: "string" },
                statusMessage: { type: "string" },
                statusCode: { type: "number" },
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    conversation: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        title: { type: "string", nullable: true },
                        type: { type: "string", enum: ["direct", "group"] },
                        description: { type: "string", nullable: true },
                        isArchived: { type: "boolean" },
                        createdBy: { type: "number" },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" },
                        lastMessageAt: { type: "string", nullable: true },
                      },
                    },
                    participants: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          conversationId: { type: "number" },
                          userId: { type: "number" },
                          role: { type: "string", enum: ["member", "admin"] },
                          joinedAt: { type: "string" },
                        },
                      },
                    },
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
  // TODO: fill out validation as needed
  validation: z.object({
    title: z.string().optional(),
    type: z.enum(["direct", "group"]),
    description: z.string().optional(),
    createdBy: z
      .number()
      .int()
      .positive("Creator ID must be a positive integer"),
    participantIds: z
      .array(z.number().int().positive())
      .min(1, "At least one participant is required"),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, payload) => {
    const db = useDb();

    // Set status code to 201 for creation
    setResponseStatus(event, 201);

    try {
      // Validate business rules
      if (payload.type === "direct" && payload.participantIds.length !== 2) {
        throw createError({
          statusCode: 422,
          statusMessage:
            "Direct conversations must have exactly 2 participants",
        });
      }

      // Ensure creator is included in participants
      if (!payload.participantIds.includes(payload.createdBy)) {
        payload.participantIds.push(payload.createdBy);
      }

      // Create the conversation
      const newConversation = await db
        .insert(conversations)
        .values({
          title: payload.title || null,
          type: payload.type,
          description: payload.description || null,
          isArchived: false,
          createdBy: payload.createdBy,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastMessageAt: null,
        })
        .returning();

      const conversationId = newConversation[0].id;

      // Create conversation participants
      const participantData = payload.participantIds.map((userId) => ({
        conversationId,
        userId,
        role:
          userId === payload.createdBy
            ? ("admin" as const)
            : ("member" as const),
        joinedAt: new Date(),
      }));

      const newParticipants = await db
        .insert(conversationParticipants)
        .values(participantData)
        .returning();

      return defineApiResponse(event, {
        data: {
          conversation: newConversation[0],
          participants: newParticipants,
        },
        statusMessage: "Conversation created successfully",
      });
    } catch (error: unknown) {
      // Handle foreign key constraint violations
      if (
        error instanceof Error &&
        error.message?.includes("FOREIGN KEY constraint failed")
      ) {
        throw createError({
          statusCode: 422,
          statusMessage: "One or more participant IDs are invalid",
        });
      }

      // Re-throw other errors
      throw error;
    }
  },
});
