import { z } from "zod";
import { eq } from "drizzle-orm";
import { posts } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["posts"],
    description: "Get a blog post by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      200: {
        description: "Blog post found",
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
                    slug: { type: "string" },
                    content: { type: "string" },
                    description: { type: "string", nullable: true },
                    author: { type: "string" },
                    status: { type: "string", enum: ["draft", "published"] },
                    published_at: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
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
  handler: async (event, { id }) => {
    const db = useDb();

    // Find the post by ID
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    return defineApiResponse(event, {
      data: post,
      statusMessage: "Post retrieved successfully",
    });
  },
});
