import { seedUsers } from "./users";
import { seedConversations } from "./conversations";

export async function runSeeders() {
  try {
    console.log("🚀 Starting database seeding...");

    // Seed users first (required for conversations)
    const users = await seedUsers();

    // Seed conversations and participants
    const conversations = await seedConversations();

    console.log("🎉 Database seeding completed successfully!");

    return {
      users,
      conversations,
    };
  } catch (error) {
    console.error("💥 Error during database seeding:", error);
    throw error;
  }
}

// Auto-run seeders if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders().catch(console.error);
}
