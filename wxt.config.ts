import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    homepage_url: "https://github.com/nralbrecht/youtube-hide-controls",
    default_locale: "en",
    permissions: ["storage"],
  },
});
