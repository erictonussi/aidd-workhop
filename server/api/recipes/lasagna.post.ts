import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import { sendStream } from "h3";

const RecipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("The name of the lasagna recipe"),
    ingredients: z.array(z.string()).describe("List of ingredients needed"),
    steps: z.array(z.string()).describe("Step-by-step cooking instructions"),
    servings: z.number().optional().describe("Number of servings"),
    prepTime: z.string().optional().describe("Preparation time"),
    cookTime: z.string().optional().describe("Cooking time"),
  }),
});

defineRouteMeta({
  openAPI: {
    tags: ["recipes"],
    description: "Generate a structured lasagna recipe using AI",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              style: {
                type: "string",
                description:
                  "Style of lasagna (e.g., 'classic', 'vegetarian', 'meat lovers')",
                default: "classic",
              },
              difficulty: {
                type: "string",
                enum: ["beginner", "intermediate", "advanced"],
                description: "Difficulty level of the recipe",
                default: "intermediate",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Streaming structured recipe data",
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
      400: {
        description: "Invalid request parameters",
      },
      500: {
        description: "Error generating recipe",
      },
    },
  },
});

export default defineApiEventHandler({
  validation: z.object({
    style: z.string().optional().default("classic"),
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional()
      .default("intermediate"),
  }),
  handler: async (
    event,
    { style = "classic", difficulty = "intermediate" }
  ) => {
    try {
      // Get OpenAI API key from runtime config
      const config = useRuntimeConfig();
      const apiKey = config.openaiApiKey;

      if (!apiKey) {
        throw createError({
          statusCode: 500,
          statusMessage: "OpenAI API key not configured",
        });
      }

      // Create OpenAI client with API key
      const openai = createOpenAI({
        apiKey,
      });

      // Create the prompt based on user parameters
      const prompt = `Generate a detailed ${style} lasagna recipe suitable for ${difficulty} level cooks. Include a creative name, complete ingredient list with quantities, and step-by-step instructions.`;

      // Use AI SDK to generate structured recipe
      const { partialObjectStream } = streamObject({
        model: openai("gpt-4o-mini"),
        schema: RecipeSchema,
        prompt,
        temperature: 0.7,
      });

      // Create streaming response using h3's sendStream
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          try {
            for await (const partialObject of partialObjectStream) {
              // Send each partial object as a JSON chunk
              const chunk = JSON.stringify(partialObject) + "\n";
              controller.enqueue(encoder.encode(chunk));
            }
          } catch (error) {
            console.error("Streaming error:", error);
            const errorChunk =
              JSON.stringify({
                error: "Failed to generate recipe",
                details:
                  error instanceof Error ? error.message : "Unknown error",
              }) + "\n";
            controller.enqueue(encoder.encode(errorChunk));
          } finally {
            controller.close();
          }
        },
      });

      // Set headers for streaming JSON
      setResponseHeaders(event, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // Use Nuxt's sendStream function
      return sendStream(event, stream);
    } catch (error) {
      console.error("Recipe generation error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to generate recipe",
        data: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});
