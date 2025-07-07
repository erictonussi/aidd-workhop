import { conversations, messages } from "../../db/drizzle-schema";

export default defineTask({
  meta: {
    name: "seed:conversations",
    description: "Seed Conversations and Messages",
  },
  run({ payload: _payload, context: _context }) {
    const db = useDb();

    console.log("🌱 Seeding conversations and messages...");

    // Sample conversations with messages
    const conversationSeeds = [
      {
        title: "Welcome to AI Chat",
        messages: [
          {
            content: "Hello! I'm your AI assistant. How can I help you today?",
            role: "assistant" as const,
          },
          {
            content:
              "Hi there! I'm excited to try out this chat interface. Can you tell me about your capabilities?",
            role: "user" as const,
          },
          {
            content:
              "I'd be happy to help! I can assist with a wide variety of tasks including answering questions, helping with writing, explaining concepts, brainstorming ideas, and much more. What would you like to explore?",
            role: "assistant" as const,
          },
        ],
      },
      {
        title: "Planning a Trip",
        messages: [
          {
            content:
              "I'm planning a trip to Japan next month. Can you help me with some recommendations?",
            role: "user" as const,
          },
          {
            content:
              "I'd love to help you plan your trip to Japan! What type of experience are you looking for? Are you interested in cultural sites, modern cities, nature, food, or a mix of everything?",
            role: "assistant" as const,
          },
          {
            content:
              "I'm really interested in experiencing traditional culture and trying authentic food. I'll be there for about 10 days.",
            role: "user" as const,
          },
          {
            content:
              "Perfect! For traditional culture and authentic food in 10 days, I'd recommend focusing on a few key areas:\n\n🏯 **Kyoto** (3-4 days): Visit Fushimi Inari, Kiyomizu-dera, and the bamboo grove. Try kaiseki dining and visit traditional tea houses.\n\n🗼 **Tokyo** (4-5 days): Explore Asakusa for traditional atmosphere, visit Meiji Shrine, and don't miss Tsukiji for fresh sushi.\n\n🗻 **Day trip options**: Consider Nikko for temples and nature, or Mount Fuji area.\n\nWould you like specific restaurant recommendations or help with an itinerary?",
            role: "assistant" as const,
          },
        ],
      },
      {
        title: "Learning Programming",
        messages: [
          {
            content:
              "I want to learn programming but I'm completely new to it. Where should I start?",
            role: "user" as const,
          },
          {
            content:
              "Great question! Learning programming is an exciting journey. Here's what I'd recommend for a complete beginner:\n\n1. **Choose a beginner-friendly language**: Python is excellent for beginners due to its simple syntax and versatility.\n\n2. **Start with fundamentals**: Learn about variables, data types, loops, and functions.\n\n3. **Practice regularly**: Consistency is key - even 30 minutes a day helps.\n\n4. **Build projects**: Start with simple projects like a calculator or to-do list.\n\nWhat interests you most? Web development, data science, mobile apps, or something else?",
            role: "assistant" as const,
          },
        ],
      },
    ];

    // Insert conversations and messages
    conversationSeeds.forEach(async (conversationSeed) => {
      try {
        // Insert conversation
        const [conversation] = await db
          .insert(conversations)
          .values({
            title: conversationSeed.title,
          })
          .returning();

        console.log(`✅ Created conversation: ${conversation.title}`);

        // Insert messages for this conversation
        for (const messageSeed of conversationSeed.messages) {
          await db.insert(messages).values({
            conversation_id: conversation.id,
            content: messageSeed.content,
            role: messageSeed.role,
          });
        }

        console.log(
          `✅ Added ${conversationSeed.messages.length} messages to ${conversation.title}`
        );
      } catch (error) {
        console.error(
          `❌ Error seeding conversation ${conversationSeed.title}:`,
          error
        );
      }
    });

    return { result: "Conversations and messages seeded successfully" };
  },
});
