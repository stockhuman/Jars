
// check for setup credentials, no redirect
new Config().pollute()
if (!window.localeStrings) setLocaleStrings()

let querymodule
let vis

// Await strings before building UI
document.addEventListener('localesReady', () => {
	vis = new Visualiser({ root: document.getElementById('vis-root'), scale: 0 })
	querymodule = new Query({ root: document.getElementById('query-root') })
})

// listen for Q requests made by query module
document.addEventListener('query-request', ({ detail }) => {
	console.log('query request', window.api + detail)
	vis.setQuery(detail) // triggers re-render and response data
})

// feeds response data to querymodule
document.addEventListener('query-response', ({ detail }) => {
	console.log('query response', detail)
	querymodule.setData(detail)
})

document.addEventListener('keyup', event => {
	if (event.key === 'Escape') {
		window.location.href = 'index.html'
	}
})


// Window control code, duplicated from main.js
// ------------------
const remote = require('@electron/remote')
const win = remote.getCurrentWindow()

// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == "complete") {
		handleWindowControls()
	}
}

window.onbeforeunload = () => {
	/* If window is reloaded, remove win event listeners
	(DOM element listeners get auto garbage collected but not
	Electron win listeners as the win is not dereferenced unless closed) */
	win.removeAllListeners()
}

function handleWindowControls() {
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('min-button').addEventListener("click", event => {
		win.minimize()
	})

	document.getElementById('max-button').addEventListener("click", event => {
		win.maximize()
	})

	document.getElementById('restore-button').addEventListener("click", event => {
		win.unmaximize()
	})

	document.getElementById('close-button').addEventListener("click", event => {
		win.close()
	})

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons()
	win.on('maximize', toggleMaxRestoreButtons)
	win.on('unmaximize', toggleMaxRestoreButtons)

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add('maximized')
		} else {
			document.body.classList.remove('maximized')
		}
	}
}
