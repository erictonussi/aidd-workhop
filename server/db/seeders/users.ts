import { users } from "../drizzle-schema";
import { useDb } from "../../utils/db";

export const userSeedData = [
  {
    email: "alice@example.com",
    username: "alice_wonderland",
    firstName: "Alice",
    lastName: "Wonderland",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    status: "online" as const,
    lastSeenAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "bob@example.com",
    username: "bob_builder",
    firstName: "Bob",
    lastName: "Builder",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    status: "offline" as const,
    lastSeenAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "charlie@example.com",
    username: "charlie_chocolate",
    firstName: "Charlie",
    lastName: "Chocolate",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
    status: "away" as const,
    lastSeenAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "diana@example.com",
    username: "diana_prince",
    firstName: "Diana",
    lastName: "Prince",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
    status: "online" as const,
    lastSeenAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "eve@example.com",
    username: "eve_online",
    firstName: "Eve",
    lastName: "Online",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve",
    status: "offline" as const,
    lastSeenAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedUsers() {
  const db = useDb();

  try {
    console.log("🌱 Seeding users...");

    // Insert users
    const insertedUsers = await db
      .insert(users)
      .values(userSeedData)
      .returning();

    console.log(`✅ Successfully seeded ${insertedUsers.length} users`);
    return insertedUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}
