document.addEventListener('mousemove', function(e) {
	var m_player = document.getElementById('c4-player');

	if (e.clientX == 0) {
		if (m_player.className.indexOf(' ytp-autohide') < 0) {
			m_player.className += ' ytp-autohide';
		}
	}
});