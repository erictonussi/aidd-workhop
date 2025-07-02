import { z } from "zod";
import { like, or, asc, count, eq } from "drizzle-orm";
import { conversations } from "../../db/drizzle-schema";

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
      {
        in: "query",
        name: "type",
        required: false,
        schema: { type: "string", enum: ["direct", "group"] },
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
                    // TODO: Customize your properties here
                    properties: {
                      id: { type: "number" },
                      title: { type: "string", nullable: true },
                      type: { type: "string", enum: ["direct", "group"] },
                      description: { type: "string", nullable: true },
                      isArchived: { type: "boolean" },
                      createdBy: { type: "number" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                      lastMessageAt: { type: "string", nullable: true },
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
    type: z.enum(["direct", "group"]).optional(),
  }),
  handler: async (event, { page, limit, search, type }) => {
    const db = useDb();

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(conversations.title, `%${search}%`),
          like(conversations.description, `%${search}%`)
        )
      );
    }

    if (type) {
      whereConditions.push(eq(conversations.type, type));
    }

    const whereClause =
      whereConditions.length > 0
        ? whereConditions.reduce((acc, condition) => acc && condition)
        : undefined;

    // Execute queries
    const [conversationList, totalCountResult] = await Promise.all([
      whereClause
        ? db
            .select()
            .from(conversations)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(conversations.lastMessageAt))
        : db
            .select()
            .from(conversations)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(conversations.lastMessageAt)),
      whereClause
        ? db.select({ count: count() }).from(conversations).where(whereClause)
        : db.select({ count: count() }).from(conversations),
    ]);

    const totalCount = totalCountResult[0].count;

    return definePaginatedApiResponse(event, {
      data: conversationList,
      statusMessage: "Retrieved conversations successfully",
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    });
  },
});
