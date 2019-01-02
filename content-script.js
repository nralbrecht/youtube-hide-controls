let settings = {
    "triggerTop": -1,
    "triggerLeft": 5,
    "triggerRight": 5,
    "triggerBottom": -1,

    "hotkey": null,
    "useHotkey": false,
    "invertTrigger": false
}
let isHidden = false;

browser.storage.local.get(settings).then(function(res) {
    for (let value in res) {
        settings[value] = res[value] || settings[value];
    }
});

browser.storage.onChanged.addListener(function(changes) {
    for (let value in changes) {
        settings[value] = changes[value].newValue;
    }
});

function getPlayerElement() {
    for (let player of document.getElementsByTagName("video")) {
        if (player.offsetParent != null) {
            return player.parentElement.parentElement.wrappedJSObject;
        }
    }

    return null;
}

function isFullscreen() {
    return !!document.mozFullScreenElement || !!document.fullscreenElement;
}

function hideControls() {
    let player = getPlayerElement();

    if (player) {
        player.hideControls();
        player.style.cursor = "none";
        isHidden = true;
    }
}

function showControls() {
    let player = getPlayerElement();

    if (player) {
        player.showControls();
        player.style.cursor = "";
        isHidden = false;
    }
}

function onFullscreenChanged() {
    if (isFullscreen() && settings.invertTrigger) {
        hideControls();
    }
    else {
        showControls();
    }
}
onFullscreenChanged();
document.addEventListener("mozfullscreenchange", onFullscreenChanged);
document.addEventListener("fullscreenchange", onFullscreenChanged);
document.addEventListener("mozfullscreenerror", onFullscreenChanged);
document.addEventListener("fullscreenerror", onFullscreenChanged);

document.addEventListener("mousemove", function(e) {
    let triggered = e.clientX <= settings.triggerLeft
        || e.clientY <= settings.triggerTop
        || document.documentElement.clientWidth - e.clientX <= settings.triggerRight
        || document.documentElement.clientHeight - e.clientY <= settings.triggerBottom;

    if (settings.invertTrigger) {
        if (!isHidden && isFullscreen() && !triggered) {
            hideControls();
        }
        else if (isHidden && ((!isFullscreen() && !triggered) || triggered)) {
            showControls();
        }
    }
    else {
        if (!isHidden && isFullscreen() && triggered) {
            hideControls();
        }
        else if (isHidden && isFullscreen() && !triggered) {
            showControls();
        }
    }
});

document.addEventListener("keypress", function(e) {
    let hotkeyOk = settings.useHotkey && settings.hotkey
        && settings.hotkey.shiftKey == e.shiftKey
        && settings.hotkey.ctrlKey == e.ctrlKey
        && settings.hotkey.metaKey == e.metaKey
        && settings.hotkey.altKey == e.altKey
        && settings.hotkey.code == e.code;

    if (isFullscreen() && hotkeyOk) {
        if (isHidden) {
            showControls();
        }
        else {
            hideControls();
        }
    }
});
