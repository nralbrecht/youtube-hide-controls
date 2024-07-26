import { onMessage } from "@/utils/messaging";

export default defineUnlistedScript(() => {
  interface YouTubePlayerElement extends HTMLElement {
    hideControls(): void;
    showControls(): void;
  }

  function isElementYouTubePlayer(
    element: Element | undefined | null
  ): element is YouTubePlayerElement {
    if (!element) {
      return false;
    }

    return "hideControls" in element;
  }

  function getPlayerElement(): YouTubePlayerElement | undefined {
    // first search by id depending on the opened page
    if ("/watch" === location.pathname || /\/(shorts\/|live$)/.test(location.pathname)) {
      const moviePlayer = document.getElementById("movie_player");
      if (isElementYouTubePlayer(moviePlayer)) {
        return moviePlayer;
      }
    } else if (/^\/(user|channel|c\/)/.test(location.pathname)) {
      const c4Player = document.getElementById("c4-player");
      if (isElementYouTubePlayer(c4Player)) {
        return c4Player;
      }
    }

    // search by class
    const videoPlayers = document.getElementsByClassName("html5-video-player");
    for (const player of videoPlayers) {
      if (isElementYouTubePlayer(player)) {
        return player;
      }
    }

    // then search by tag name
    const videoElement = document.getElementsByTagName("video");
    for (const player of videoElement) {
      if (
        player.offsetParent !== null &&
        isElementYouTubePlayer(player.parentElement?.parentElement)
      ) {
        return player.parentElement.parentElement;
      }
    }

    console.error("[youtube-hide-controls] could not find the player element");
    return undefined;
  }

  function setControlsVisibility(visible: boolean): void {
    const player = getPlayerElement();

    if (!player) {
      return;
    }

    if (visible) {
      player.showControls();
      player.style.cursor = "";
    } else {
      player.hideControls();
      player.style.cursor = "none";
    }
  }

  function setVideoOverlaysVisibility(visible: boolean): void {
    if (visible) {
      document.body.classList.remove("hideVideoOverlays");
    } else {
      document.body.classList.add("hideVideoOverlays");
    }
  }

  function setPlayPauseAnimationVisibility(visible: boolean): void {
    if (visible) {
      document.body.classList.remove("hidePlayPauseAnimation");
    } else {
      document.body.classList.add("hidePlayPauseAnimation");
    }
  }

  onMessage("setControlsVisibility", ({ data }) => {
    setControlsVisibility(data);
  });
  onMessage("setVideoOverlaysVisibility", ({ data }) => {
    setVideoOverlaysVisibility(data);
  });
  onMessage("setPlayPauseAnimationVisibility", ({ data }) => {
    setPlayPauseAnimationVisibility(data);
  });
});
