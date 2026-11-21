// Custom titlebar buttons. They're hidden on macOS, which draws its own
// traffic lights. The main process does the actual work (see src/index.js).
;(() => {
	const { ipcRenderer } = require('electron')

	const setMaximized = maximized => document.body.classList.toggle('maximized', maximized)
	const button = (id, action) => document.getElementById(id)
		.addEventListener('click', () => ipcRenderer.send('window-control', action))

	ipcRenderer.on('window-maximized', (event, maximized) => setMaximized(maximized))

	document.addEventListener('DOMContentLoaded', () => {
		button('min-button', 'minimize')
		button('max-button', 'maximize')
		button('restore-button', 'unmaximize')
		button('close-button', 'close')
		ipcRenderer.invoke('window-is-maximized').then(setMaximized)
	})
})()
