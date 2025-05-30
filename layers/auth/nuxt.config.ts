import { resolvePath } from "nuxt/kit";

export default defineNuxtConfig({
  alias: {
    "@layer/auth/": await resolvePath(__dirname),
  },
});
