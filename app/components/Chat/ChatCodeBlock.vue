<script setup lang="ts">
import type { CodeBlock } from "./Chat.vue";

const props = defineProps<{ codeBlock: CodeBlock }>();

const copied = ref(false);

async function copyCode() {
  await navigator.clipboard.writeText(props.codeBlock.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1200);
}
</script>

<template>
  <UiCard class="relative group overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-2 bg-muted/50 border-b"
    >
      <UiBadge
        v-if="props.codeBlock.language"
        variant="secondary"
        class="text-xs font-mono"
      >
        {{ props.codeBlock.language }}
      </UiBadge>
      <div v-else class="text-xs text-muted-foreground font-mono">Code</div>

      <UiTooltip>
        <UiTooltipTrigger as-child>
          <UiButton
            variant="ghost"
            size="sm"
            class="h-6 px-2"
            @click="copyCode"
          >
            <Icon
              :name="copied ? 'lucide:check' : 'lucide:copy'"
              class="w-3 h-3 mr-1"
            />
            <span class="text-xs">{{ copied ? "Copied!" : "Copy" }}</span>
          </UiButton>
        </UiTooltipTrigger>
        <UiTooltipContent>
          <p>{{ copied ? "Copied to clipboard" : "Copy code" }}</p>
        </UiTooltipContent>
      </UiTooltip>
    </div>

    <!-- Code Content -->
    <UiCardContent class="p-0">
      <div class="max-h-96 overflow-y-auto overflow-x-auto">
        <pre
          class="px-4 py-3 text-sm font-mono text-foreground"
        ><code>{{ props.codeBlock.code }}</code></pre>
      </div>
    </UiCardContent>
  </UiCard>
</template>
