import { conversations, messages } from "../../db/drizzle-schema";

export default defineTask({
  meta: {
    name: "seed:conversations",
    description: "Seed dummy conversations",
  },
  async run() {
    const db = useDb();

    await db.delete(messages);
    await db.delete(conversations);

    const now = new Date();
    const seededConversations = await db
      .insert(conversations)
      .values([
        {
          title: "Trip planning assistant",
          created_at: now,
          updated_at: now,
        },
        {
          title: "Weekly meal prep ideas",
          created_at: now,
          updated_at: now,
        },
        {
          title: "Learn Nuxt in 30 days",
          created_at: now,
          updated_at: now,
        },
      ])
      .returning();

    return {
      result: "Success",
      message: `Seeded ${seededConversations.length} conversations`,
      data: seededConversations,
    };
  },
});
