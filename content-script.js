let hotkey;
let useHotkey;
let triggerDistance;
let isHidden = false;

browser.storage.local.get(["triggerDistance", "useHotkey", "hotkey"], function(res) {
    triggerDistance = res.triggerDistance || 5;
    useHotkey = res.useHotkey || false;
    hotkey = res.hotkey || null;
});

browser.storage.onChanged.addListener(function(changes) {
    if (changes.triggerDistance) {
        triggerDistance = changes.triggerDistance.newValue;
    }
    if (changes.useHotkey) {
        useHotkey = changes.useHotkey.newValue;
    }
    if (changes.hotkey) {
        hotkey = changes.hotkey.newValue;
    }
});

function hideControls() {
    var player = document.getElementsByTagName("video")[0].parentElement.parentElement.wrappedJSObject;

    player.hideControls();
    player.style.cursor = "none";
    isHidden = true;
}

function showControls() {
    var player = document.getElementsByTagName("video")[0].parentElement.parentElement.wrappedJSObject;

    player.showControls();
    player.style.cursor = "";
    isHidden = false;
}

document.addEventListener("mousemove", function(e) {
    if (e.clientX <= triggerDistance) {
        hideControls();
    } else if (isHidden && e.clientX > triggerDistance) {
        showControls();
    }
});

document.addEventListener("keypress", function(e) { 
    if (useHotkey && hotkey) {
        if (hotkey.shiftKey == e.shiftKey && hotkey.ctrlKey == e.ctrlKey && hotkey.metaKey == e.metaKey && hotkey.altKey == e.altKey && hotkey.key == e.key) {
            hideControls();
        }
    }
});