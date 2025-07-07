import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

/**
 * Generates a concise, descriptive title for a conversation based on the first message
 * @param firstMessage The content of the first user message
 * @returns A promise that resolves to a generated title (max 50 characters)
 */
export async function generateConversationTitle(
  firstMessage: string
): Promise<string> {
  const config = useRuntimeConfig();

  try {
    const openai = createOpenAI({
      apiKey: config.openaiApiKey,
    });

    const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: `Generate a concise, descriptive title (maximum 50 characters) for a conversation based on the user's first message. The title should capture the main topic or intent. Respond with only the title, no quotes or extra text.`,
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      maxTokens: 20, // Keep it short
      temperature: 0.7,
    });

    // Ensure the title doesn't exceed 50 characters
    let title = result.text.trim();
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }

    return title || "New Conversation";
  } catch (error) {
    console.error("Error generating conversation title:", error);
    // Fallback: create a simple title from the first few words
    const words = firstMessage.split(" ").slice(0, 6);
    let fallbackTitle = words.join(" ");
    if (fallbackTitle.length > 50) {
      fallbackTitle = fallbackTitle.substring(0, 47) + "...";
    }
    return fallbackTitle || "New Conversation";
  }
}
