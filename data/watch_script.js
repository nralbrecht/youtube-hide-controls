var triggered = false;
var key_was_pressed = false;
var options = {};

var m_player = document.getElementById('c4-player');
if (m_player == null) {
	m_player = document.getElementById('movie_player');
}

self.port.on("prefs", function(newOptions) {
	options = newOptions;
});

document.addEventListener('mousemove', function(e) {
	if (e.clientX <= options.actionPadding) {
		if (m_player.className.indexOf(' ytp-autohide') < 0) {
			m_player.className += ' ytp-autohide';
			triggered = true;
			m_player.fucus();
		}
	} else if ((triggered && e.clientX > options.actionPadding) || key_was_pressed) {
		if (m_player.className.indexOf(' ytp-autohide') >= 0) {
			m_player.className = m_player.className.replace(/ ytp-autohide/, "");
		}
		triggered = false;
		key_was_pressed = false;
	}
});

document.addEventListener('keydown', function(e) {
	if (e.keyCode === options.keyCode) {
		if (m_player.className.indexOf(' ytp-autohide') < 0) {
			m_player.className += ' ytp-autohide';
			key_was_pressed = true;
			m_player.fucus();
		}
	}
});
