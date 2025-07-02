import { z } from "zod";
import { users } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["users"],
    description: "Create a new user",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              username: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              avatarUrl: { type: "string", format: "uri", nullable: true },
              status: { type: "string", enum: ["online", "offline", "away"] },
            },
            required: ["email", "username", "firstName", "lastName"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
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
                    email: { type: "string" },
                    username: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    avatarUrl: { type: "string", nullable: true },
                    status: {
                      type: "string",
                      enum: ["online", "offline", "away"],
                    },
                    lastSeenAt: { type: "string", nullable: true },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },
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
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    avatarUrl: z.string().url("Invalid avatar URL").optional(),
    status: z.enum(["online", "offline", "away"]).default("offline"),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, payload) => {
    const db = useDb();

    // Set status code to 201 for creation
    setResponseStatus(event, 201);

    try {
      // Create the user
      const newUser = await db
        .insert(users)
        .values({
          email: payload.email,
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatarUrl: payload.avatarUrl || null,
          status: payload.status,
          lastSeenAt: payload.status === "online" ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return defineApiResponse(event, {
        data: newUser[0],
        statusMessage: "User created successfully",
      });
    } catch (error: unknown) {
      // Handle unique constraint violations
      if (
        error instanceof Error &&
        error.message?.includes("UNIQUE constraint failed")
      ) {
        if (error.message.includes("email")) {
          throw createError({
            statusCode: 422,
            statusMessage: "A user with this email already exists",
          });
        }
        if (error.message.includes("username")) {
          throw createError({
            statusCode: 422,
            statusMessage: "A user with this username already exists",
          });
        }
      }

      // Re-throw other errors
      throw error;
    }
  },
});
