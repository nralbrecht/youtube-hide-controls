let hotkeyInput = document.querySelector("#hotkey input");
let useHotkeyInput = document.querySelector("#useHotkey input");

let triggerTop = document.querySelector("#top");
let triggerLeft = document.querySelector("#left");
let triggerRight = document.querySelector("#right");
let triggerBottom = document.querySelector("#bottom");

function keyToString(e) {
	if (e.shiftKey == undefined && e.ctrlKey == undefined && e.metaKey == undefined && e.altKey == undefined && e.key == undefined) return false;

	let result = "";
	if (e.ctrlKey) result += "Ctrl+";
	if (e.shiftKey) result += "Shift+";
	if (e.altKey) result += "Alt+";
	if (e.meta) result += "Meta+";
	if (e.code.startsWith("Numpad")) result += "Numpad ";
	result += e.key[0].toUpperCase() + e.key.substr(1);

	return result;
}

browser.storage.local.get(["triggerTop", "triggerLeft", "triggerRight", "triggerBottom", "useHotkey", "hotkey"]).then(function(res) {
	triggerTop.value = res.triggerTop || -1;
	triggerLeft.value = res.triggerLeft || 5;
	triggerRight.value = res.triggerRight || -1;
	triggerBottom.value = res.triggerBottom || -1;

	useHotkeyInput.checked = res.useHotkey || false;
	if (!useHotkeyInput.checked) hotkeyInput.disabled = true;

	hotkeyInput.value = keyToString(res.hotkey) || "none";
});

function updateTrigger(e) {
	if (e.target.validity.valid) {
		let temp = {};
		temp["trigger" + e.target.name] = e.target.value;
		console.log("insert: ", temp);
		browser.storage.local.set(temp);
	}
}

triggerTop.addEventListener("input", updateTrigger);
triggerLeft.addEventListener("input", updateTrigger);
triggerRight.addEventListener("input", updateTrigger);
triggerBottom.addEventListener("input", updateTrigger);

useHotkeyInput.addEventListener("click", function(e) {
	if (e.target.checked) {
		hotkeyInput.disabled = false;
	} else {
		hotkeyInput.disabled = true;
	}

	browser.storage.local.set({
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
		"code": e.code,
		"key": e.key
	}
	e.preventDefault();
	e.target.value = keyToString(hotkey);
	browser.storage.local.set({ hotkey });
});

document.querySelector("#triggerDistance .preferences-title").innerText = browser.i18n.getMessage("triggerDistanceOptionTitle");
document.querySelector("#triggerDistance .preferences-description").innerText = browser.i18n.getMessage("triggerDistanceOptionDescription");
document.querySelector("#useHotkey .preferences-title").innerText = browser.i18n.getMessage("useHotkeyOptionTitle");
document.querySelector("#hotkey .preferences-title").innerText = browser.i18n.getMessage("hotkeyOptionTitle");
document.querySelector("#hotkey .preferences-description").innerText = browser.i18n.getMessage("hotkeyOptionDescription");
