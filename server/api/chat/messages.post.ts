import { z } from "zod";
import { eq } from "drizzle-orm";
import { conversations, messages } from "../../db/drizzle-schema";

const dummyReplies = [
  "Got it. I will help you with that.",
  "Nice prompt. Here is a first draft answer for you.",
  "Great question. A practical next step is to break this into smaller tasks.",
  "Understood. I can provide a clearer version if you share more context.",
];

function buildDummyReply(content: string) {
  const sanitized = content.trim().toLowerCase();
  const hash = Array.from(sanitized).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return dummyReplies[hash % dummyReplies.length];
}

export default defineApiEventHandler({
  validation: z.object({
    conversationId: z.coerce.number().int().positive(),
    content: z.string().min(1, "Message content is required"),
  }),
  handler: async (event, { conversationId, content }) => {
    const db = useDb();

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation not found",
      });
    }

    const now = new Date();
    const [userMessage] = await db
      .insert(messages)
      .values({
        conversation_id: conversationId,
        role: "user",
        content,
        created_at: now,
      })
      .returning();

    const [assistantMessage] = await db
      .insert(messages)
      .values({
        conversation_id: conversationId,
        role: "assistant",
        content: buildDummyReply(content),
        created_at: new Date(now.getTime() + 500),
      })
      .returning();

    await db
      .update(conversations)
      .set({ updated_at: new Date() })
      .where(eq(conversations.id, conversationId));

    return defineApiResponse(event, {
      data: {
        conversationId,
        userMessage,
        assistantMessage,
      },
      statusMessage: "Message sent successfully",
    });
  },
});
