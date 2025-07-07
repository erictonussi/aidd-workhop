import { z } from "zod";
import { eq, like, or, desc, asc, count, and } from "drizzle-orm";
import { posts } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["posts"],
    description: "Get all blog posts with pagination and search",
    parameters: [
      {
        in: "query",
        name: "page",
        required: false,
        schema: { type: "number", default: 1 },
      },
      {
        in: "query",
        name: "limit",
        required: false,
        schema: { type: "number", default: 20 },
      },
      {
        in: "query",
        name: "search",
        required: false,
        schema: { type: "string" },
      },
      {
        in: "query",
        name: "status",
        required: false,
        schema: { type: "string", enum: ["draft", "published"] },
      },
      {
        in: "query",
        name: "author",
        required: false,
        schema: { type: "string" },
      },
      {
        in: "query",
        name: "sortBy",
        required: false,
        schema: {
          type: "string",
          enum: ["created_at", "updated_at", "published_at", "title"],
          default: "created_at",
        },
      },
      {
        in: "query",
        name: "sortOrder",
        required: false,
        schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
      },
    ],
    responses: {
      200: {
        description: "List of blog posts",
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
                  type: "array",
                  items: {
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
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "number" },
                    limit: { type: "number" },
                    total: { type: "number" },
                    currentPageUrl: { type: "string" },
                    firstPageUrl: { type: "string" },
                    lastPageUrl: { type: "string" },
                    nextPageUrl: { type: "string", nullable: true },
                    prevPageUrl: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

export default defineApiEventHandler({
  // TODO: fill out validation as needed
  validation: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
    author: z.string().optional(),
    sortBy: z
      .enum(["created_at", "updated_at", "published_at", "title"])
      .default("created_at"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
  handler: async (
    event,
    { page, limit, search, status, author, sortBy, sortOrder }
  ) => {
    const db = useDb();

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.content, `%${search}%`),
          like(posts.description, `%${search}%`)
        )
      );
    }

    if (status) {
      whereConditions.push(eq(posts.status, status));
    }

    if (author) {
      whereConditions.push(like(posts.author, `%${author}%`));
    }

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(posts)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalResult.count;

    // Build order by
    const orderBy =
      sortOrder === "asc" ? asc(posts[sortBy]) : desc(posts[sortBy]);

    // Get paginated results
    const offset = (page - 1) * limit;
    const postsData = await db
      .select()
      .from(posts)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return definePaginatedApiResponse(event, {
      data: postsData,
      statusMessage: "Retrieved posts successfully",
      pagination: {
        page,
        limit,
        total,
      },
    });
  },
});
