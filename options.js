let triggerDistanceInput = document.getElementById('triggerDistance');

chrome.storage.local.get("triggerDistance", function(res) {
	if (res.triggerDistance !== undefined) {
		triggerDistanceInput.value = res.triggerDistance;
	}
	else {
		triggerDistanceInput.value = 5;

		chrome.storage.local.set({
			"triggerDistance": 5
		});
	}
});

triggerDistanceInput.addEventListener("input", function(e) {
	if (e.target.validity.valid) {
		chrome.storage.local.set({
			"triggerDistance": e.target.value
		});
	}
});
