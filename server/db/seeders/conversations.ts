import { conversations, conversationParticipants } from "../drizzle-schema";
import { useDb } from "../../utils/db";

export const conversationSeedData = [
  {
    title: "Team Chat",
    type: "group" as const,
    description: "General discussion for the team",
    isArchived: false,
    createdBy: 1, // Alice
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(),
  },
  {
    title: "Project Planning",
    type: "group" as const,
    description: "Discussions about upcoming projects",
    isArchived: false,
    createdBy: 2, // Bob
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    title: null, // Direct message - no title needed
    type: "direct" as const,
    description: null,
    isArchived: false,
    createdBy: 1, // Alice
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    title: null, // Direct message - no title needed
    type: "direct" as const,
    description: null,
    isArchived: false,
    createdBy: 3, // Charlie
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
];

export const participantSeedData = [
  // Team Chat participants (conversation 1)
  {
    conversationId: 1,
    userId: 1,
    role: "admin" as const,
    joinedAt: new Date(),
  }, // Alice
  {
    conversationId: 1,
    userId: 2,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Bob
  {
    conversationId: 1,
    userId: 3,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Charlie
  {
    conversationId: 1,
    userId: 4,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Diana

  // Project Planning participants (conversation 2)
  {
    conversationId: 2,
    userId: 2,
    role: "admin" as const,
    joinedAt: new Date(),
  }, // Bob
  {
    conversationId: 2,
    userId: 1,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Alice
  {
    conversationId: 2,
    userId: 4,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Diana

  // Direct message between Alice and Bob (conversation 3)
  {
    conversationId: 3,
    userId: 1,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Alice
  {
    conversationId: 3,
    userId: 2,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Bob

  // Direct message between Charlie and Diana (conversation 4)
  {
    conversationId: 4,
    userId: 3,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Charlie
  {
    conversationId: 4,
    userId: 4,
    role: "member" as const,
    joinedAt: new Date(),
  }, // Diana
];

export async function seedConversations() {
  const db = useDb();

  try {
    console.log("🌱 Seeding conversations...");

    // Insert conversations
    const insertedConversations = await db
      .insert(conversations)
      .values(conversationSeedData)
      .returning();
    console.log(
      `✅ Successfully seeded ${insertedConversations.length} conversations`
    );

    // Insert conversation participants
    const insertedParticipants = await db
      .insert(conversationParticipants)
      .values(participantSeedData)
      .returning();
    console.log(
      `✅ Successfully seeded ${insertedParticipants.length} conversation participants`
    );

    return {
      conversations: insertedConversations,
      participants: insertedParticipants,
    };
  } catch (error) {
    console.error("❌ Error seeding conversations:", error);
    throw error;
  }
}
