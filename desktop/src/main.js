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
		// let d = prompt('Enter your date of birth\nin the format MM/DD/YYYY')
		// if (d === null) {
		// 	console.log('[Jars] Date of birth defaulting to 01/01/2000')
		// 	localStorage.setItem('dob', '01/01/2000')
		// } else {
		// 	localStorage.setItem('dob', d)
		// }
	}

	let api = localStorage.getItem('api')
	if (api === null) {
		// api = prompt('Enter the api url to your database\nex: https://api.jars.com/v1/')
		// if (api === null) {
			alert('Jars set to localStorage mode.')
			alert('Manually set API URL in localStorage with key "api"')
		// } else {
		// 	localStorage.setItem('api', api)
		// 	window.api = api
		// }
	} else {
		window.api = api
	}
}
setup()

// Files are to be written so that they may one day be migrated to 'modern' approaches
const log = new LogForm({ root: document.getElementById('log-root') })
const cal = new Calendar({ root: document.getElementById('cal-root') })
const hed = new Header({ root: document.getElementById('header-root') })
const vis = new Visualiser({ root: document.getElementById('vis-root')})

const cinfo = document.getElementById('cal-info')

// This script shall function as a controller in an MVC pattern
let year = new Date().getFullYear()
let selectedDay = new Date()


// lists detailed logs for a given day
const updateLogs = async () => {
	let html = ''
	let hours = 0
	let records = []

	if (window.api) {
		// imediately set a 'loading' text
		document.getElementById('meta-root').innerHTML = 'fetching...'

		// see https://github.com/mevdschee/php-crud-api
		let query = `?filter=date,sw,${selectedDay.toISOString().slice(0, 10)}`
		let db = await fetch(window.api + query).then(r => r.json())

		if (db && db.records.length > 0) {
			records = db.records
		}

	} else {
		let keys = Object.keys(localStorage)
		keys = keys.filter(key => key.startsWith(selectedDay.toISOString().slice(0, 10)))
		keys.forEach(key => {
			records.push(JSON.parse(localStorage.getItem(key)))
		})
	}

	records.forEach(res => {
		hours += filterFloat(res.hours)
		html += `<div class="log-detail">
				<span class="cat ${res.category || 'null'}">[${res.category || 'null'}]</span>
				<span class="hours">(${res.hours}) </span>
				<span class="name">${res.project} - ${res.task}</span>
				<span class="time">${res.tod || new Date(res.date).toTimeString().split(' ')[0]}</span>
			</div>`
	})


	document.getElementById('meta-root').innerHTML =
		`<div class="meta-table">
			<header>
				${records.length > 0 ? hours + ' hour' + (hours == 1 ? '': 's') + ' recorded' : 'No records'}
			</header>
			<div class="meta-table-body">
				${html}
			</div>
		</div>`
}

// update text describing chosen date in calendar
const calInfo = () => {
	let month = selectedDay.getUTCMonth()
	let date = selectedDay.getUTCDate()
	let day = selectedDay.getUTCDay() - 1
	if (day < 0) day = 6


	let diff = ((new Date(
		new Date().getUTCFullYear(),
		new Date().getUTCMonth(),
		new Date().getUTCDate(),
		0) - new Date(year, month, date)) / 86400000)
	let num = Math.abs(diff).toFixed()
	let calc

	if (diff < 0) {
		calc = `In ${num} Day${num > 1 ? 's' : ''}.`
	} else if (diff == 0) {
		calc = `Today.`
	} else {
		calc = `${num} Day${num > 1 ? 's' : ''} ago.`
	}

	cinfo.innerHTML = `<p>${monthNames[month]} ${date}, ${dayNames[day]}. ${calc}</p>`
}

// listen for custom events
const events = () => {
	document.addEventListener('calendar-select', e => {
		selectedDay = new Date(e.detail)
		log.alterDate(selectedDay)
		updateLogs()
		calInfo()
	})

	document.addEventListener('commit', () => {
		updateLogs()
		vis.render()
	})

	document.addEventListener('year-change', e => {
		year = e.detail
		cal.setYear(year)
		vis.setYear(year)
	})
}

events()
