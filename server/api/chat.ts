import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export default defineEventHandler(async (event) => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error("Missing OpenAI API key");
  const openai = createOpenAI({
    apiKey: apiKey,
  });
  const { messages } = await readBody(event);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse();
});
