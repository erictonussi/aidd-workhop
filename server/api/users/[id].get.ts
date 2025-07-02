import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["users"],
    description: "Get a user by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      200: {
        description: "User found",
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
      404: {
        description: "User not found",
      },
    },
  },
});

export default defineApiEventHandler({
  // TODO: fill out validation as needed
  validation: z.object({
    id: z
      .string()
      .min(1, "ID is required")
      .transform((val) => parseInt(val, 10)),
  }),
  handler: async (event, { id }) => {
    const db = useDb();

    // Find the user
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!user.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return defineApiResponse(event, {
      data: user[0],
      statusMessage: "User retrieved successfully",
    });
  },
});
