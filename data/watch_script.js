var triggered = false;
var options = {};

self.port.on("prefs", function(newOptions) {
	options = newOptions;
	console.log(options.actionPadding);
});

document.addEventListener('mousemove', function(e) {
	var m_player = document.getElementById('c4-player');
	if (m_player == null) {
		m_player = document.getElementById('movie_player');
	}

	if (e.clientX <= options.actionPadding) {
		if (m_player.className.indexOf(' ytp-autohide') < 0) {
			m_player.className += ' ytp-autohide';
			triggered = true;
		}
	} else if (triggered && e.clientX > options.actionPadding) {
		if (m_player.className.indexOf(' ytp-autohide') >= 0) {
			m_player.className = m_player.className.replace(/ ytp-autohide/, "");
		}
		triggered = false;
	}
});