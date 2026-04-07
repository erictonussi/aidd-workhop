<script setup lang="ts">
definePageMeta({
  title: "Accordion Demo",
  description: "A vertically stacked set of interactive headings",
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Accordion</h1>
      <p class="text-muted-foreground mt-2">
        A vertically stacked set of interactive headings that each reveal a
        section of content.
      </p>
    </div>

    <!-- Single Accordion -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Single Accordion</h2>
      <UiAccordion type="single" collapsible class="w-full">
        <UiAccordionItem value="item-1">
          <UiAccordionTrigger>Is it accessible?</UiAccordionTrigger>
          <UiAccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern and is built with
            keyboard navigation in mind.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="item-2">
          <UiAccordionTrigger>Is it styled?</UiAccordionTrigger>
          <UiAccordionContent>
            Yes. It comes with default styles that match the other components'
            aesthetic.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="item-3">
          <UiAccordionTrigger>Is it animated?</UiAccordionTrigger>
          <UiAccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </div>

    <!-- Multiple Accordion -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Multiple Accordion</h2>
      <UiAccordion type="multiple" class="w-full">
        <UiAccordionItem value="item-1">
          <UiAccordionTrigger>Framework Support</UiAccordionTrigger>
          <UiAccordionContent>
            This component library works with Vue.js, Nuxt.js, and other
            Vue-based frameworks.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="item-2">
          <UiAccordionTrigger>Customization</UiAccordionTrigger>
          <UiAccordionContent>
            You can customize the appearance using Tailwind CSS classes or by
            modifying the component styles.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="item-3">
          <UiAccordionTrigger>TypeScript Support</UiAccordionTrigger>
          <UiAccordionContent>
            Full TypeScript support is included out of the box for better
            development experience.
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </div>

    <!-- FAQ Example -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">FAQ Example</h2>
      <UiAccordion type="single" collapsible class="w-full">
        <UiAccordionItem value="faq-1">
          <UiAccordionTrigger
            >What payment methods do you accept?</UiAccordionTrigger
          >
          <UiAccordionContent>
            We accept all major credit cards, PayPal, Apple Pay, and Google Pay.
            All payments are processed securely through our payment provider.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="faq-2">
          <UiAccordionTrigger>How long does shipping take?</UiAccordionTrigger>
          <UiAccordionContent>
            Standard shipping takes 3-5 business days. Express shipping is
            available for 1-2 business days. International shipping varies by
            location.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="faq-3">
          <UiAccordionTrigger>Can I return my purchase?</UiAccordionTrigger>
          <UiAccordionContent>
            Yes, we offer a 30-day return policy for most items. Items must be
            in original condition and packaging. Some restrictions apply for
            personalized items.
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem value="faq-4">
          <UiAccordionTrigger>Do you offer customer support?</UiAccordionTrigger>
          <UiAccordionContent>
            We provide 24/7 customer support via email and live chat. Our
            support team typically responds within 2-4 hours during business
            days.
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </div>
  </div>
</template>
