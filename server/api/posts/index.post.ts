import { z } from "zod";
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
    description: "Create a new blog post",
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
              status: {
                type: "string",
                enum: ["draft", "published"],
                default: "draft",
              },
              published_at: { type: "string", format: "date-time" },
            },
            required: ["title", "content", "author"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Blog post created successfully",
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
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(255, "Slug must be less than 255 characters")
      .optional(),
    content: z.string().min(1, "Content is required"),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
    author: z
      .string()
      .min(1, "Author is required")
      .max(100, "Author must be less than 100 characters"),
    status: z.enum(["draft", "published"]).default("draft"),
    published_at: z.string().datetime().optional(),
  }),
  // guards: [userIsLoggedInGuard], // TODO: Add authentication if needed
  handler: async (event, payload) => {
    const db = useDb();

    // Set status code to 201 for creation
    setResponseStatus(event, 201);

    // Generate slug if not provided
    const slug = payload.slug || generateSlug(payload.title);

    // Handle published_at based on status
    const published_at =
      payload.status === "published"
        ? payload.published_at
          ? new Date(payload.published_at)
          : new Date()
        : null;

    const now = new Date();

    // Create the post
    const [newPost] = await db
      .insert(posts)
      .values({
        title: payload.title,
        slug,
        content: payload.content,
        description: payload.description || null,
        author: payload.author,
        status: payload.status,
        published_at,
        created_at: now,
        updated_at: now,
      })
      .returning();

    return defineApiResponse(event, {
      data: newPost,
      statusMessage: "Post created successfully",
    });
  },
});
