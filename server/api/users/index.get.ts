import { z } from "zod";
import { like, or, asc, count } from "drizzle-orm";
import { users } from "../../db/drizzle-schema";

defineRouteMeta({
  // TODO: fill out meta as needed
  openAPI: {
    tags: ["users"],
    description: "Get all users",
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
        description: "List of users",
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

    // Build where condition for search
    const searchFilter = search
      ? or(
          like(users.username, `%${search}%`),
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      : undefined;

    // Execute queries
    const [userList, totalCountResult] = await Promise.all([
      search
        ? db
            .select()
            .from(users)
            .where(searchFilter!)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(users.createdAt))
        : db
            .select()
            .from(users)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(users.createdAt)),
      search
        ? db.select({ count: count() }).from(users).where(searchFilter!)
        : db.select({ count: count() }).from(users),
    ]);

    const totalCount = totalCountResult[0].count;

    return definePaginatedApiResponse(event, {
      data: userList,
      statusMessage: "Retrieved users successfully",
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    });
  },
});
