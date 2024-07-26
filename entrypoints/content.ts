import { doesEventMatchHotkey } from "@/utils/hotkey";
import { sendMessage } from "@/utils/messaging";
import { Settings } from "@/utils/settings.js";
import injectStyleUrl from "~/assets/inject.css?url";
import icon from "~/public/icon.svg";
import { PlayerStateMachine } from "~/utils/state-machine.js";

export default defineContentScript({
  matches: ["*://www.youtube.com/*"],
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
      console.log("[youtube-hide-controls] HIDE_PLAYER!", settings);
      await sendMessage("setControlsVisibility", true);
    }

    async function showControls(): Promise<void> {
      console.log("[youtube-hide-controls] SHOW_PLAYER!", settings);
      await sendMessage("setControlsVisibility", false);
    }

    async function updateClassNames(): Promise<void> {
      await sendMessage(
        "setVideoOverlaysVisibility",
        !(await settings.hideVideoOverlays.getValue())
      );
      await sendMessage(
        "setPlayPauseAnimationVisibility",
        !(await settings.hidePlayPauseAnimation.getValue())
      );
    }

    const settings = new Settings();
    const stateMachine = new PlayerStateMachine(showControls, hideControls, settings);
    settings.addOnChangeListener(() => {
      stateMachine.send("settingsChanged");
      updateClassNames();
      onFullscreenChanged();
      updateInjectedOptionButton();
    });

    // handle fullscreen change
    function isFullscreen(): boolean {
      if (settings.onlyFullscreen) {
        return Boolean(document.fullscreenElement);
      }
      return true;
    }

    function onFullscreenChanged(): void {
      if (isFullscreen()) {
        stateMachine.send("fullscreenEntered");
      } else {
        stateMachine.send("fullscreenExited");
      }
    }

    document.addEventListener("fullscreenchange", onFullscreenChanged);
    document.addEventListener("fullscreenerror", onFullscreenChanged);

    // handle mouse tigger zone
    document.addEventListener("mousemove", async (event) => {
      if (!settings.useMouse) {
        return;
      }

      const triggerLeft = await settings.triggerLeft.getValue();
      const triggerTop = await settings.triggerTop.getValue();
      const triggerRight = await settings.triggerRight.getValue();
      const triggerBottom = await settings.triggerBottom.getValue();

      const mouseIsInTriggerZone =
        event.clientX < triggerLeft ||
        event.clientY < triggerTop ||
        document.documentElement.clientWidth - event.clientX < triggerRight ||
        document.documentElement.clientHeight - event.clientY < triggerBottom;

      if (mouseIsInTriggerZone) {
        stateMachine.send("mouseTriggerZoneEntered");
      } else {
        stateMachine.send("mouseTriggerZoneExited");
      }
    });

    // handle hotkey
    document.addEventListener("keydown", async (event) => {
      const useHotkey = await settings.hotkey.getValue();

      if (!useHotkey) {
        return;
      }

      const hotkey = await settings.hotkey.getValue();

      if (!hotkey) {
        return;
      }

      if (doesEventMatchHotkey(hotkey, event)) {
        stateMachine.send("hotkey");
      }
    });

    // inject button to the addon option page
    function updateInjectedOptionButton(): void {
      let optionButtonContainer = document.getElementById("hide-controls-options-button");

      if (optionButtonContainer && !settings.injectOptionButton) {
        // remove if option changed
        optionButtonContainer.style.display = "none";
        return;
      } else if (!optionButtonContainer && !settings.injectOptionButton) {
        return;
      } else if (optionButtonContainer) {
        // ignore if allready injected
        optionButtonContainer.style.display = "block";
        return;
      }

      const rightHeaderContainer = document.querySelector("ytd-masthead #end");

      if (!rightHeaderContainer) {
        setTimeout(() => updateInjectedOptionButton(), 1000);
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
