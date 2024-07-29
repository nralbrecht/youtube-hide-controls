import { doesEventMatchHotkey } from "@/utils/hotkey";
import { sendMessage } from "@/utils/messaging";
import { addonSettings } from "@/utils/settings.js";
import icon from "~/assets/icon.svg";
import injectStyleUrl from "~/assets/inject.css?url";
import { PlayerStateMachine } from "~/utils/state-machine.js";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  runAt: "document_idle",
  main(): void {
    // inject player script
    const script = document.createElement("script");
    script.setAttribute("src", browser.runtime.getURL("/inject.js"));
    script.addEventListener("load", function () {
      this.remove();
    });
    (document.head || document.documentElement).appendChild(script);

    // inject styles
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", injectStyleUrl);
    (document.head || document.documentElement).appendChild(style);

    async function hideControls(): Promise<void> {
      console.log("[youtube-hide-controls] HIDE_PLAYER!");
      await sendMessage("setControlsVisibility", false);
    }

    async function showControls(): Promise<void> {
      console.log("[youtube-hide-controls] SHOW_PLAYER!");
      await sendMessage("setControlsVisibility", true);
    }

    async function updateClassNames(): Promise<void> {
      await sendMessage(
        "setVideoOverlaysVisibility",
        !(await addonSettings.getValue()).hideVideoOverlays
      );
      await sendMessage(
        "setPlayPauseAnimationVisibility",
        !(await addonSettings.getValue()).hidePlayPauseAnimation
      );
    }

    const stateMachine = new PlayerStateMachine(showControls, hideControls);
    addonSettings.watch(async () => {
      await updateClassNames();
      await onFullscreenChanged();
      await updateInjectedOptionButton();
    });

    // handle fullscreen change
    async function isFullscreen(): Promise<boolean> {
      const { onlyFullscreen } = await addonSettings.getValue();

      if (onlyFullscreen) {
        return Boolean(document.fullscreenElement);
      }
      return true;
    }

    async function onFullscreenChanged(): Promise<void> {
      if (await isFullscreen()) {
        stateMachine.send({ type: "fullscreenEntered" });
      } else {
        stateMachine.send({ type: "fullscreenExited" });
      }
    }

    document.addEventListener("fullscreenchange", onFullscreenChanged);
    document.addEventListener("fullscreenerror", onFullscreenChanged);

    // handle mouse tigger zone
    document.addEventListener("mousemove", async (event) => {
      const { useMouse, trigger } = await addonSettings.getValue();

      if (!useMouse) {
        return;
      }

      const mouseIsInTriggerZone =
        event.clientX < trigger.left ||
        event.clientY < trigger.top ||
        document.documentElement.clientWidth - event.clientX < trigger.right ||
        document.documentElement.clientHeight - event.clientY < trigger.bottom;

      if (mouseIsInTriggerZone) {
        stateMachine.send({ type: "mouseTriggerZoneEntered" });
      } else {
        stateMachine.send({ type: "mouseTriggerZoneExited" });
      }
    });

    // handle hotkey
    document.addEventListener("keydown", async (event) => {
      const { useHotkey, hotkey } = await addonSettings.getValue();

      if (!useHotkey || !hotkey) {
        return;
      }

      if (doesEventMatchHotkey(hotkey, event)) {
        stateMachine.send({ type: "hotkeyPressed" });
      }
    });

    // inject button to the addon option page
    async function updateInjectedOptionButton(): Promise<void> {
      const { injectOptionButton } = await addonSettings.getValue();
      let optionButtonContainer = document.getElementById("hide-controls-options-button");

      if (optionButtonContainer && !injectOptionButton) {
        // remove if option changed
        optionButtonContainer.style.display = "none";
        return;
      } else if (!optionButtonContainer && !injectOptionButton) {
        return;
      } else if (optionButtonContainer) {
        // ignore if allready injected
        optionButtonContainer.style.display = "block";
        return;
      }

      const rightHeaderContainer = document.querySelector("ytd-masthead #end");

      if (!rightHeaderContainer) {
        setTimeout(updateInjectedOptionButton, 1000);
        return;
      }

      optionButtonContainer = document.createElement("yt-icon-button");
      optionButtonContainer.id = "hide-controls-options-button";
      optionButtonContainer.setAttribute("label", "Hide Control Options");
      optionButtonContainer.className = "style-scope ytd-masthead";

      const iconElement = document.createElement("img");
      iconElement.src = icon;
      iconElement.className = "style-scope ytd-masthead";
      optionButtonContainer.appendChild(iconElement);
      rightHeaderContainer.prepend(optionButtonContainer);

      optionButtonContainer.addEventListener("click", () => {
        const existingOptionPopupElement = document.getElementById("hide-controls-option-popup");

        if (existingOptionPopupElement) {
          if (existingOptionPopupElement.style.display === "none") {
            existingOptionPopupElement.style.display = "block";
          } else {
            existingOptionPopupElement.style.display = "none";
          }
        } else {
          const newOptionPopupElement = document.createElement("iframe");

          newOptionPopupElement.src = browser.runtime.getURL("/options.html");
          newOptionPopupElement.id = "hide-controls-option-popup";

          document.body.appendChild(newOptionPopupElement);
          document.addEventListener("keydown", (event) => {
            if ("Escape" === event.key) {
              newOptionPopupElement.style.display = "none";
            }
          });
          document.addEventListener("click", (event) => {
            if (
              newOptionPopupElement.style.display !== "none" &&
              !optionButtonContainer.contains(event.target as Node) &&
              !newOptionPopupElement.contains(event.target as Node)
            ) {
              newOptionPopupElement.style.display = "none";
            }
          });
        }
      });
    }
  },
});
