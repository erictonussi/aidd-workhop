import { z } from "zod";
import { eq } from "drizzle-orm";
import { posts } from "../../db/drizzle-schema";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["posts"],
    description: "Update a blog post by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              content: { type: "string" },
              description: { type: "string" },
              author: { type: "string" },
              status: { type: "string", enum: ["draft", "published"] },
              published_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Blog post updated successfully",
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
      422: {
        description: "Validation error",
      },
    },
  },
});

export default defineApiEventHandler({
  validation: z.object({
    id: z
      .string()
      .min(1, "ID is required")
      .transform((val) => parseInt(val, 10)),
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters")
      .optional(),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(255, "Slug must be less than 255 characters")
      .optional(),
    content: z.string().min(1, "Content is required").optional(),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
    author: z
      .string()
      .min(1, "Author is required")
      .max(100, "Author must be less than 100 characters")
      .optional(),
    status: z.enum(["draft", "published"]).optional(),
    published_at: z.string().datetime().optional(),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, { id, ...updateData }) => {
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

    // Prepare update data
    const updateFields: Partial<typeof posts.$inferInsert> = {
      updated_at: new Date(),
    };

    // Only update fields that are provided
    if (updateData.title !== undefined) {
      updateFields.title = updateData.title;
      // Auto-generate slug if title changes and no slug is provided
      if (updateData.slug === undefined) {
        updateFields.slug = generateSlug(updateData.title);
      }
    }

    if (updateData.slug !== undefined) {
      updateFields.slug = updateData.slug;
    }

    if (updateData.content !== undefined) {
      updateFields.content = updateData.content;
    }

    if (updateData.description !== undefined) {
      updateFields.description = updateData.description;
    }

    if (updateData.author !== undefined) {
      updateFields.author = updateData.author;
    }

    if (updateData.status !== undefined) {
      updateFields.status = updateData.status;

      // Handle published_at when status changes
      if (
        updateData.status === "published" &&
        existingPost.status === "draft"
      ) {
        updateFields.published_at = updateData.published_at
          ? new Date(updateData.published_at)
          : new Date();
      } else if (updateData.status === "draft") {
        updateFields.published_at = null;
      }
    }

    if (
      updateData.published_at !== undefined &&
      updateFields.status !== "draft"
    ) {
      updateFields.published_at = new Date(updateData.published_at);
    }

    // Update the post
    const [updatedPost] = await db
      .update(posts)
      .set(updateFields)
      .where(eq(posts.id, id))
      .returning();

    return defineApiResponse(event, {
      data: updatedPost,
      statusMessage: "Post updated successfully",
    });
  },
});
