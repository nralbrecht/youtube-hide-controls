import { defineConfig } from "wxt";
import { Manifest } from "wxt/browser";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },

  manifest: ({ browser }) => {
    const manifest: Partial<Manifest.WebExtensionManifest> = {
      name: "__MSG_extensionName__",
      description: "__MSG_extensionDescription__",
      homepage_url: "https://github.com/nralbrecht/youtube-hide-controls",
      default_locale: "en",
      permissions: ["storage"],
      host_permissions: ["*://*.youtube.com/*"],
    };

    if (browser === "firefox") {
      manifest.browser_specific_settings = {
        gecko: {
          id: "@hideyoutubecontrolls",
          strict_min_version: "64.0",
        },
      };
    }

    return manifest;
  },
});
