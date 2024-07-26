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

  function hideControls(): void {
    const player = getPlayerElement();

    if (player) {
      player.hideControls();
      player.style.cursor = "none";
    }
  }

  function showControls(): void {
    const player = getPlayerElement();

    if (player) {
      player.showControls();
      player.style.cursor = "";
    }
  }

  function hideVideoOverlays(shouldHide: boolean): void {
    if (shouldHide) {
      document.body.classList.add("hideVideoOverlays");
    } else {
      document.body.classList.remove("hideVideoOverlays");
    }
  }

  function hidePlayPauseAnimation(shouldHide: boolean): void {
    if (shouldHide) {
      document.body.classList.add("hidePlayPauseAnimation");
    } else {
      document.body.classList.remove("hidePlayPauseAnimation");
    }
  }

  window.addEventListener("message", (event): void => {
    if (
      event.source != window ||
      (!event.data.source && event.data.source !== "YOUTUBE_HIDE_CONTROL")
    ) {
      return;
    }

    if (event.data.action && event.data.action === "SHOW_PLAYER") {
      showControls();
    } else if (event.data.action && event.data.action === "HIDE_PLAYER") {
      hideControls();
    } else if (
      event.data.action &&
      event.data.action === "HIDE_VIDEO_OVERLAYS" &&
      event.data.value !== undefined
    ) {
      hideVideoOverlays(event.data.value);
    } else if (
      event.data.action &&
      event.data.action === "HIDE_PLAY_PAUSE_ANIMATION" &&
      event.data.value !== undefined
    ) {
      hidePlayPauseAnimation(event.data.value);
    }
  });
});
