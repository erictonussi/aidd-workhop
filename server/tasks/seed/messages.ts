import { asc, eq } from "drizzle-orm";
import { conversations, messages } from "../../db/drizzle-schema";

export default defineTask({
  meta: {
    name: "seed:messages",
    description: "Seed dummy messages for conversations",
  },
  async run() {
    const db = useDb();

    const existingConversations = await db
      .select()
      .from(conversations)
      .orderBy(asc(conversations.id));

    if (existingConversations.length === 0) {
      return {
        result: "Skipped",
        message:
          "No conversations found. Run /_nitro/tasks/seed:conversations first.",
      };
    }

    for (const conversation of existingConversations) {
      await db.delete(messages).where(eq(messages.conversation_id, conversation.id));
    }

    const baseTime = Date.now();
    const seededMessages = await db
      .insert(messages)
      .values([
        {
          conversation_id: existingConversations[0].id,
          role: "user",
          content: "Can you help me build a 4-day Tokyo itinerary?",
          created_at: new Date(baseTime),
        },
        {
          conversation_id: existingConversations[0].id,
          role: "assistant",
          content:
            "Absolutely. I can suggest a mix of neighborhoods, food spots, and day trips.",
          created_at: new Date(baseTime + 1000),
        },
        {
          conversation_id: existingConversations[1].id,
          role: "user",
          content: "Give me 5 high-protein lunch options under 20 minutes.",
          created_at: new Date(baseTime + 2000),
        },
        {
          conversation_id: existingConversations[1].id,
          role: "assistant",
          content:
            "Great idea. Try chicken burrito bowls, tuna wraps, egg fried rice, greek yogurt parfaits, and turkey quesadillas.",
          created_at: new Date(baseTime + 3000),
        },
        {
          conversation_id: existingConversations[2].id,
          role: "user",
          content: "Create a Nuxt 4 study plan for a beginner.",
          created_at: new Date(baseTime + 4000),
        },
        {
          conversation_id: existingConversations[2].id,
          role: "assistant",
          content:
            "Start with routing and pages in week 1, data fetching and server routes in week 2, UI components in week 3, and testing/deployment in week 4.",
          created_at: new Date(baseTime + 5000),
        },
      ])
      .returning();

    return {
      result: "Success",
      message: `Seeded ${seededMessages.length} messages`,
      data: seededMessages,
    };
  },
});
