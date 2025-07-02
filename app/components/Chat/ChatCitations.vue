<script setup lang="ts">
import type { DocumentCitation } from "./Chat.vue";

const props = defineProps<{ citations: DocumentCitation[] }>();

const expanded = ref<string | null>(null);

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id;
}
</script>

<template>
  <div class="space-y-2">
    <UiCard
      v-for="citation in props.citations"
      :key="citation.id"
      class="transition-colors hover:bg-accent/50"
    >
      <UiCardContent class="p-3">
        <UiCollapsible :open="expanded === citation.id">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <a
                :href="citation.url"
                target="_blank"
                class="font-medium text-primary hover:text-primary/80 hover:underline"
              >
                {{ citation.title }}
              </a>
            </div>

            <div class="flex items-center gap-2 ml-2">
              <UiBadge
                v-if="citation.relevance"
                variant="outline"
                class="text-xs"
              >
                {{ (citation.relevance * 100).toFixed(0) }}% match
              </UiBadge>

              <UiCollapsibleTrigger as-child>
                <UiButton
                  variant="ghost"
                  size="sm"
                  class="h-6 px-2"
                  @click="toggle(citation.id)"
                >
                  <span class="text-xs mr-1">
                    {{ expanded === citation.id ? "Hide" : "Show" }}
                  </span>
                  <Icon
                    :name="
                      expanded === citation.id
                        ? 'lucide:chevron-up'
                        : 'lucide:chevron-down'
                    "
                    class="w-3 h-3"
                  />
                </UiButton>
              </UiCollapsibleTrigger>
            </div>
          </div>

          <UiCollapsibleContent>
            <div class="mt-3 pt-3 border-t border-border">
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ citation.excerpt }}
              </p>
              <div class="flex items-center justify-between mt-2">
                <UiBadge variant="secondary" class="text-xs">
                  Source Document
                </UiBadge>
                <a
                  :href="citation.url"
                  target="_blank"
                  class="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>View full document</span>
                  <Icon name="lucide:external-link" class="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </UiCollapsibleContent>
        </UiCollapsible>
      </UiCardContent>
    </UiCard>
  </div>
</template>
