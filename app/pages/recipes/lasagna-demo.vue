<script setup>
const isLoading = ref(false);
const recipe = ref(null);
const error = ref(null);
const style = ref("classic");
const difficulty = ref("intermediate");

const generateRecipe = async () => {
  isLoading.value = true;
  error.value = null;
  recipe.value = null;

  try {
    // eslint-disable-next-line
    const response = await fetch("/api/recipes/lasagna", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        style: style.value,
        difficulty: difficulty.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const partialRecipe = JSON.parse(line);
            recipe.value = partialRecipe;
          } catch {
            console.warn("Failed to parse JSON line:", line);
          }
        }
      }
    }
  } catch (err) {
    error.value = err.message;
    console.error("Recipe generation error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">AI Lasagna Recipe Generator</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Style</label>
          <select v-model="style" class="w-full p-2 border rounded-md">
            <option value="classic">Classic</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="meat lovers">Meat Lovers</option>
            <option value="seafood">Seafood</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Difficulty</label>
          <select v-model="difficulty" class="w-full p-2 border rounded-md">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          @click="generateRecipe"
        >
          {{ isLoading ? "Generating Recipe..." : "Generate Recipe" }}
        </button>
      </div>

      <!-- Results -->
      <div class="space-y-4">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          Error: {{ error }}
        </div>

        <div
          v-if="isLoading"
          class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded"
        >
          Generating your {{ style }} lasagna recipe...
        </div>

        <div
          v-if="recipe?.recipe"
          class="bg-white border rounded-lg p-6 shadow-sm"
        >
          <h2 class="text-2xl font-bold mb-4">
            {{ recipe.recipe.name || "Loading..." }}
          </h2>

          <div
            v-if="
              recipe.recipe.servings ||
              recipe.recipe.prepTime ||
              recipe.recipe.cookTime
            "
            class="flex gap-4 mb-4 text-sm text-gray-600"
          >
            <span v-if="recipe.recipe.servings"
              >{{ recipe.recipe.servings }} servings</span
            >
            <span v-if="recipe.recipe.prepTime"
              >Prep: {{ recipe.recipe.prepTime }}</span
            >
            <span v-if="recipe.recipe.cookTime"
              >Cook: {{ recipe.recipe.cookTime }}</span
            >
          </div>

          <div v-if="recipe.recipe.ingredients?.length" class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Ingredients</h3>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="ingredient in recipe.recipe.ingredients"
                :key="ingredient"
              >
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div v-if="recipe.recipe.steps?.length" class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Instructions</h3>
            <ol class="list-decimal list-inside space-y-2">
              <li
                v-for="step in recipe.recipe.steps"
                :key="step"
                class="leading-relaxed"
              >
                {{ step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
