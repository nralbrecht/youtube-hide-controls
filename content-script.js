let yt_player = null;
let triggered = false;

let triggerDistance;
let useHotkey;
let hotkey;

chrome.storage.local.get(["triggerDistance", "useHotkey", "hotkey"], function(res) {
    triggerDistance = res.triggerDistance || 5;
    useHotkey = res.useHotkey || false;
    hotkey = res.hotkey || null;
});

chrome.storage.onChanged.addListener(function(changes) {
    if (changes["triggerDistance"]) {
        triggerDistance = changes["triggerDistance"].newValue;
    }
    if (changes["useHotkey"]) {
        useHotkey = changes["useHotkey"].newValue;
    }
    if (changes["hotkey"]) {
        hotkey = changes["hotkey"].newValue;
    }
});

function hideControls() {
    if (yt_player.className.indexOf(" ytp-autohide") < 0) {
        yt_player.className += " ytp-autohide";
        yt_player.focus();
        triggered = true;
    }
}

function showControls() {
    if (yt_player.className.indexOf(" ytp-autohide") >= 0) {
        yt_player.className = yt_player.className.replace(/ ytp-autohide/, "");
        triggered = false;
    }
}

let mousemove_handler = function(e) {
    if (e.clientX <= triggerDistance) {
        hideControls();
    } else if (triggered && e.clientX > triggerDistance) {
        showControls();
    }
}

let keypress_handler = function(e) {
    if (useHotkey && hotkey) {
        if (hotkey.shiftKey == e.shiftKey && hotkey.ctrlKey == e.ctrlKey && hotkey.metaKey == e.metaKey && hotkey.altKey == e.altKey && hotkey.key == e.key) {
            hideControls();
        }
    }
}

let interval_id = setInterval(function() {
    yt_player = document.getElementById("c4-player") || document.getElementById("movie_player");

    if(yt_player){
        clearInterval(interval_id);
        document.addEventListener("mousemove", mousemove_handler);
        document.addEventListener("keypress", keypress_handler);
    }
}, 750);
