let triggerDistanceInput = document.getElementsByName("triggerDistance")[0];
let useHotkeyInput = document.getElementsByName("useHotkey")[0];
let hotkeyInput = document.getElementsByName("hotkey")[0];

function keyToString(e) {
	if (e.shiftKey == undefined && e.ctrlKey == undefined && e.metaKey == undefined && e.altKey == undefined && e.key == undefined) return false;

	let result = (e.ctrlKey)? "Ctrl+" : "";
	result += (e.shiftKey)? "Shift+" : "";
	result += (e.altKey)? "Alt+" : "";
	result += (e.meta)? "Meta+" : "";
	result += e.key[0].toUpperCase() + e.key.substr(1);

	return result;
}

chrome.storage.local.get(["triggerDistance", "useHotkey", "hotkey"], function(res) {
	triggerDistanceInput.value = res.triggerDistance || 5;
	useHotkeyInput.checked = res.useHotkey || false;
	if (!useHotkeyInput.checked) hotkeyInput.disabled = true;
	hotkeyInput.value = keyToString(res.hotkey) || "none";
});

triggerDistanceInput.addEventListener("input", function(e) {
	if (e.target.validity.valid) {
		chrome.storage.local.set({
			"triggerDistance": e.target.value
		});
	}
});

useHotkeyInput.addEventListener("click", function(e) {
	if (e.target.checked) {
		hotkeyInput.disabled = false;
	} else {
		hotkeyInput.disabled = true;
	}

	chrome.storage.local.set({
		"useHotkey": e.target.checked
	});
});

hotkeyInput.addEventListener("keypress", function(e) {
	if (e.keyCode < 20 && e.keyCode > 15) return;
	if (document.activeElement.name !== "hotkey") return;

	let hotkey = {
		"shiftKey": e.shiftKey,
		"ctrlKey": e.ctrlKey,
		"metaKey": e.metaKey,
		"altKey": e.altKey,
		"key": e.key
	}
	e.preventDefault();
	e.target.value = keyToString(hotkey);
	chrome.storage.local.set({ hotkey });
});
