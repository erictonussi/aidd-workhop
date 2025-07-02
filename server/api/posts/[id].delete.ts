import { z } from "zod";
import { eq } from "drizzle-orm";
import { posts } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["posts"],
    description: "Delete a blog post by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      200: {
        description: "Blog post deleted successfully",
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
        description: "Post not found",
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
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { id }) => {
    const db = useDb();

    // First, check if the post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    // Delete the post
    await db.delete(posts).where(eq(posts.id, id));

    return defineApiResponse(event, {
      data: { id, deleted: true },
      statusMessage: "Post deleted successfully",
    });
  },
});
