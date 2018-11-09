let settings = {
    "triggerTop": -1,
    "triggerLeft": 5,
    "triggerRight": -1,
    "triggerBottom": -1,

    "hotkey": null,
    "useHotkey": false
}
let isHidden = false;

browser.storage.local.get(settings).then(function(res) {
    settings.triggerTop = res.triggerTop || settings.triggerTop;
    settings.triggerLeft = res.triggerLeft ||settings.triggerLeft;
    settings.triggerRight = res.triggerRight || settings.triggerRight;
    settings.triggerBottom = res.triggerBottom || settings.triggerBottom;

    settings.hotkey = res.hotkey || settings.hotkey;
    settings.useHotkey = res.useHotkey || settings.useHotkey;
});

browser.storage.onChanged.addListener(function(changes) {
    if (changes.triggerTop) {
        settings.triggerTop = changes.triggerTop.newValue;
    }
    if (changes.triggerLeft) {
        settings.triggerLeft = changes.triggerLeft.newValue;
    }
    if (changes.triggerRight) {
        settings.triggerRight = changes.triggerRight.newValue;
    }
    if (changes.triggerBottom) {
        settings.triggerBottom = changes.triggerBottom.newValue;
    }
    if (changes.useHotkey) {
        settings.useHotkey = changes.useHotkey.newValue;
    }
    if (changes.hotkey) {
        settings.hotkey = changes.hotkey.newValue;
    }
});

function getPlayerElement() {
    return document.getElementsByTagName("video")[0].parentElement.parentElement.wrappedJSObject;
}

function hideControls() {
    let player = getPlayerElement();

    player.hideControls();
    player.style.cursor = "none";
    isHidden = true;
}

function showControls() {
    let player = getPlayerElement();

    player.showControls();
    player.style.cursor = "";
    isHidden = false;
}

document.addEventListener("mousemove", function(e) {
    let triggered = e.clientX <= settings.triggerLeft
        || e.clientY <= settings.triggerTop
        || document.documentElement.clientWidth - e.clientX <= settings.triggerRight
        || document.documentElement.clientHeight - e.clientY <= settings.triggerBottom;

    if (triggered && getPlayerElement().classList.contains("ytp-fullscreen")) {
        hideControls();
    } else if (isHidden) {
        showControls();
    }
});

document.addEventListener("keypress", function(e) { 
    if (settings.useHotkey && settings.hotkey) {
        if (settings.hotkey.shiftKey == e.shiftKey && settings.hotkey.ctrlKey == e.ctrlKey && settings.hotkey.metaKey == e.metaKey && settings.hotkey.altKey == e.altKey && settings.hotkey.key == e.key) {
            if (isHidden) {
                showControls();
            } else {
                hideControls();
            }
        }
    }
});