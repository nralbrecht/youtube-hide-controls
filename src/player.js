function getPlayerElement() {
    // first search by id depending on the opened page
    if ("/watch" === location.pathname || /\/(shorts\/|live$)/.test(location.pathname)) {
        const moviePlayer = document.getElementById("movie_player");
        if (moviePlayer && moviePlayer.hideControls) {
            return moviePlayer;
        }
    }
    else if (/^\/(user|channel|c\/)/.test(location.pathname)) {
        const c4Player = document.getElementById("c4-player");
        if (c4Player && c4Player.hideControls) {
            return c4Player;
        }
    }

    // search by class
    const videoPlayers = document.getElementsByClassName("html5-video-player");
    for (let player of videoPlayers) {
        if (player.hideControls) {
            return player;
        }
    }

    // then search by tag name
    const videoElement = document.getElementsByTagName("video");
    for (let player of videoElement) {
        if (player.offsetParent !== null) {
            return player.parentElement.parentElement;
        }
    }

    console.error("[youtube-hide-controls] could not find the player element");
    return null;
}

function hideControls() {
    const player = getPlayerElement();

    if (player) {
        player.hideControls();
        player.style.cursor = "none";
    }
}

function showControls() {
    const player = getPlayerElement();

    if (player) {
        player.showControls();
        player.style.cursor = "";
    }
}

function hideVideoOverlays(value) {
    if (value) {
        document.body.classList.add("hideVideoOverlays");
    }
    else {
        document.body.classList.remove("hideVideoOverlays");
    }
}

function hidePlayPauseAnimation(value) {
    if (value) {
        document.body.classList.add("hidePlayPauseAnimation");
    }
    else {
        document.body.classList.remove("hidePlayPauseAnimation");
    }
}

window.addEventListener("message", function(event) {
    if (event.source != window || !event.data.source && event.data.source !== "YOUTUBE_HIDE_CONTROL") {
        return;
    }

    if (event.data.action && event.data.action === "SHOW_PLAYER") {
        showControls();
    }
    else if (event.data.action && event.data.action === "HIDE_PLAYER") {
        hideControls();
    }
    else if (event.data.action && event.data.action === "HIDE_VIDEO_OVERLAYS" && event.data.value !== undefined) {
        hideVideoOverlays(event.data.value);
    }
    else if (event.data.action && event.data.action === "HIDE_PLAY_PAUSE_ANIMATION" && event.data.value !== undefined) {
        hidePlayPauseAnimation(event.data.value);
    }
}, false);
