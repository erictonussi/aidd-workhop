// https://nuxt.com/docs/api/configuration/nuxt-config
import VueSourceTagPlugin from "./vue-source-tag-plugin";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  vite: {
    plugins: [
      VueSourceTagPlugin(),
      {
        name: "vite-custom-event",
        configureServer(server) {
          server.ws.on("custom:my-event", ({ message }) => {
            console.log("Received from client:", message);
            server.ws.send("response", { message: "Hello from server!" });
          });
        },
      },
    ],
  },
});
