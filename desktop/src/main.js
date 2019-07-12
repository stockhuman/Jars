// I have decided to take the no-tooling approach on this project.
// Modern tooling is excellent, and I dearly miss import {} et al.
// All the same, setting up babel, jsx and the like is cutting in
// far too much to my dev time. Whilst I know how to do it, and I
// really do enjoy it, I have come to realise that I can't go on.

// check for setup credentials
const setup = () => {
	let d = localStorage.getItem('dob')
	if (d === null) {
		// NOTE: prompt does not work in electron :(
		alert('Manually set date of birth in localStorage formatted as MM/DD/YYYY, key "dob"')
	}

	let api = localStorage.getItem('api')
	if (api === null) {
			alert('Jars set to localStorage mode.')
			alert('Manually set API URL in localStorage with key "api"')
	} else {
		window.api = api
	}
}

setup()

// Files are to be written so that they may one day be migrated to 'modern' approaches
const log = new LogForm({ root: document.getElementById('log-root') })
const cal = new Calendar({
	root: document.getElementById('cal-root'),
	info: document.getElementById('cal-info')
})
const vis = new Visualiser({ root: document.getElementById('vis-root') })
const header = new Header({ root: document.getElementById('header-root') })
const meta = new Meta({ root: document.getElementById('meta-root') })

// This script shall function as a controller in an MVC pattern
let year = new Date().getFullYear()
let selectedDay = new Date()

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
}

events()
