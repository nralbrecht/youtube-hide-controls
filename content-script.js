let triggerDistance = 20;
let triggered = false;
let yt_player = null;

let mousemove_handler = function(e) {
    if (e.clientX <= triggerDistance) {
        if (yt_player.className.indexOf(" ytp-autohide") < 0) {
            yt_player.className += " ytp-autohide";
            triggered = true;
            yt_player.focus();
        }
    } else if (triggered && e.clientX > triggerDistance) {
        if (yt_player.className.indexOf(" ytp-autohide") >= 0) {
            yt_player.className = yt_player.className.replace(/ ytp-autohide/, "");
        }
        triggered = false;
    }
};

let interval_id = setInterval(function() {
    yt_player = document.getElementById("c4-player") || document.getElementById("movie_player");

    if(yt_player){
        clearInterval(interval_id);
        document.addEventListener("mousemove", mousemove_handler);
    }
}, 1000);
