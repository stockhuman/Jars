// I have decided to take the no-tooling approach on this project.
// Modern tooling is excellent, and I dearly miss import {} et al.
// All the same, setting up babel, jsx and the like is cutting in
// far too much to my dev time. Whilst I know how to do it, and I
// really do enjoy it, I have come to realise that I can't go on.

// check for setup credentials
new Config().pollute()
window.storage = new StorageHandler()
if (!window.localeStrings) setLocaleStrings()

// This script functions as the controller in an MVC pattern
let year = new Date().getFullYear()
let selectedDay = new Date()

let log
let cal
let vis
let header
let meta

const init = () => {
	// Files are to be written so that they may one day be migrated to 'modern' approaches
	log = new LogForm({ root: document.getElementById('log-root') })
	cal = new Calendar({
		root: document.getElementById('cal-root'),
		info: document.getElementById('cal-info')
	})
	vis = new Visualiser({ root: document.getElementById('vis-root') })
	header = new Header({ root: document.getElementById('header-root') })
	meta = new Meta({ root: document.getElementById('meta-root') })

	// listen for custom events
	const events = () => {
		document.addEventListener('calendar-select', e => {
			selectedDay = new Date(e.detail)
			log.alterDate(selectedDay)
			meta.render(selectedDay)
			cal.describe(selectedDay)
		})

		document.addEventListener('commit', () => {
			meta.render(selectedDay)
			vis.render()
		})

		document.addEventListener('year-change', e => {
			year = e.detail
			cal.setYear(year)
			vis.setYear(year)
		})

		document.addEventListener('setup', () => {
			window.location.href = 'setup.html'
		})

		document.addEventListener('query', () => {
			window.location.href = 'query.html'
		})

		document.addEventListener('render', (date = new Date()) => {
			// accomodate the format of custom events
			date = date.detail.selectedDay || date

			log.alterDate(date)
			meta.render(date)
			cal.describe(date)
			cal.today()
			vis.render()
			cal.render()
		})

		document.addEventListener('tick', () => header.render())
	}

	events()
}

// Await strings before building UI
document.addEventListener('localesReady', init)

let waitingForDailyUpdate = false

// event fires when app regains network connection
window.addEventListener('online', () => {
	if (waitingForDailyUpdate) {
		waitingForDailyUpdate = false
		selectedDay = new Date()
		document.dispatchEvent(new CustomEvent('render', { detail: selectedDay }))
	}
})

// Updates dates and time every hour
// via https://stackoverflow.com/questions/19847412/
const tick = () => {
	setInterval(() => {
		let stillToday = selectedDay.getDate() === new Date().getDate()
		if (!stillToday) { // it is now another day, app shoudl update UI
			if (navigator.onLine) { // device is online
				selectedDay = new Date()
				document.dispatchEvent(new CustomEvent('render', { detail: selectedDay }))
			} else { // device is not online, but date has changed (likely overnight)
				waitingForDailyUpdate = true
			}
		}
		// render every hour (for greetings)
		document.dispatchEvent(new CustomEvent('tick'))
	}, 1000 * 60 * 60)
}

let intervalDate = new Date()
if (intervalDate.getMinutes() === 0) {
	tick()
} else {
	intervalDate.setHours(intervalDate.getHours() + 1)
	intervalDate.setMinutes(0)
	intervalDate.setSeconds(0)

	let difference = intervalDate - new Date()
	setTimeout(tick, difference)
}

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
	toggleMaxRestoreButtons();
	win.on('maximize', toggleMaxRestoreButtons);
	win.on('unmaximize', toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add('maximized')
		} else {
			document.body.classList.remove('maximized')
		}
	}
}
