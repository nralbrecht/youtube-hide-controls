import { defineWindowMessaging } from "@webext-core/messaging/page";

export interface PlayerMessengerSchema {
  setControlsVisibility(visible: boolean): void;
  setVideoOverlaysVisibility(visible: boolean): void;
  setPlayPauseAnimationVisibility(visible: boolean): void;
}

export const { onMessage, sendMessage } = defineWindowMessaging<PlayerMessengerSchema>({
  namespace: "YOUTUBE_HIDE_CONTROL",
});
