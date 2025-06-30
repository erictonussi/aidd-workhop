// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  nitro: {
    experimental: {
      openAPI: true,
    },
    openAPI: {
      production: "prerender",
      meta: {
        title: "My Awesome Project",
        description: "This might become the next big thing.",
        version: "1.0",
      },
    },
  },
});
