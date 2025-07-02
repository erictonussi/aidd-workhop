import { z } from "zod";
import { conversations } from "../../db/drizzle-schema";
import { desc, count, like } from "drizzle-orm";

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
                error: { type: "boolean" },
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
                      title: { type: "string", nullable: true },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
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

    const offset = (page - 1) * limit;

    // Build query conditions
    const whereConditions = search
      ? like(conversations.title, `%${search}%`)
      : undefined;

    // Get conversations with pagination
    const conversationList = await db
      .select()
      .from(conversations)
      .where(whereConditions)
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(conversations)
      .where(whereConditions);

    const total = totalResult[0]?.count || 0;

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
