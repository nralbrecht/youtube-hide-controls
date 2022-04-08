function getPlayerElement() {
    // first search by id
    const moviePlayer = document.getElementById("movie_player");
    if (moviePlayer && moviePlayer.hideControls) {
        return moviePlayer;
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
        if (player.offsetParent != null ) {
            return player.parentElement.parentElement;
        }
    }

    return null;
}

function hideControls() {
    const player = getPlayerElement();

    player.hideControls();
    player.style.cursor = "none";
}

function showControls() {
    const player = getPlayerElement();

    player.showControls();
    player.style.cursor = "";
}

window.addEventListener("message", function(event) {
    if (event.source != window || !event.data.source && event.data.source != "YOUTUBE_HIDE_CONTROL") {
        return;
    }

    if (event.data.action && event.data.action == "SHOW_PLAYER") {
        showControls();
    }
    else if (event.data.action && event.data.action == "HIDE_PLAYER") {
        hideControls();
    }
}, false);
