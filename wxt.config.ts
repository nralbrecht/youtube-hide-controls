import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },

  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    homepage_url: "https://github.com/nralbrecht/youtube-hide-controls",
    default_locale: "en",
    permissions: ["storage"],
  },
});
