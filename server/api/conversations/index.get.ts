import { z } from "zod";
import { and, count, desc, like } from "drizzle-orm";
import { conversations } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["conversations"],
    description: "Get all conversations",
    parameters: [
      { in: "query", name: "page", required: false, schema: { type: "number", default: 1 } },
      { in: "query", name: "limit", required: false, schema: { type: "number", default: 20 } },
      { in: "query", name: "search", required: false, schema: { type: "string" } },
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
                    // TODO: Customize your properties here
                    properties: {
                      id: { type: "string" },
                      someField: { type: "string" },
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
  validation: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
  }),
  handler: async (event, { page, limit, search }) => {
    const db = useDb();

    const whereConditions = [];
    if (search) {
      whereConditions.push(like(conversations.title, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(conversations)
      .where(whereClause);

    const total = totalResult.count;
    const offset = (page - 1) * limit;

    const conversationList = await db
      .select()
      .from(conversations)
      .where(whereClause)
      .orderBy(desc(conversations.updated_at))
      .limit(limit)
      .offset(offset);

    return definePaginatedApiResponse(event, {
      data: conversationList,
      statusMessage: "Retrieved conversations successfully",
      pagination: {
        page,
        limit,
        total,
      },
    });
  },
});