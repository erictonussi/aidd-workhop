import { z } from "zod";
import { conversations } from "../../db/drizzle-schema";
import { desc, like, count } from "drizzle-orm";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Get all conversations",
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
    ],
    responses: {
      200: {
        description: "List of conversations",
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
  }),
  handler: async (event, { page, limit, search }) => {
    const db = useDb();

    // Build where condition
    const whereCondition = search
      ? like(conversations.title, `%${search}%`)
      : undefined;

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(conversations)
      .where(whereCondition);

    const total = totalResult.count;

    // Get paginated results
    const offset = (page - 1) * limit;
    const data = await db
      .select()
      .from(conversations)
      .where(whereCondition)
      .orderBy(desc(conversations.updated_at))
      .limit(limit)
      .offset(offset);

    return definePaginatedApiResponse(event, {
      data,
      statusMessage: "Retrieved conversations successfully",
      pagination: {
        page,
        limit,
        total,
      },
    });
  },
});
