// I have decided to take the no-tooling approach on this project.
// Modern tooling is excellent, and I dearly miss import {} et al.
// All the same, setting up babel, jsx and the like is cutting in
// far too much to my dev time. Whilst I know how to do it, and I
// really do enjoy it, I have come to realise that I can't go on.

// Files are to be written so that they may one day be migrated to modern approaches
const log = new LogForm({ root: document.getElementById('log-root') })
const cal = new Calendar({ root: document.getElementById('cal-root') })

const cinfo = document.getElementById('cal-info')

// This script shall function as a controller in an MVC pattern
let year = new Date().getFullYear()
let selectedDay = new Date()

// listen for custom events
document.addEventListener('calendar-select', e => {
	selectedDay = new Date(e.detail)
	updateLogs()
	calInfo()
})

document.addEventListener('calendar-blur', e => {
	selectedDay = new Date()
	// cinfo.innerHTML = ''
	// document.getElementById('meta-root').innerHTML = ''
})

const yearProgress = year => {
	const diff = new Date() - new Date(year, 0, 1, 0)
	const progress = ((diff / 31536000000) * 100).toFixed(2)
	const yd = Math.abs((progress / 100).toFixed(2))

	return progress < 0
		? yd + ` YEARS AWAY` : progress > 100
		? yd + ` YEARS AGO` : progress + "%"
}

const changeYear = dir => {
	year += dir
	cal.setYear(year)
	setHeader()
}

const setHeader = () => {
	document.getElementById('header-root').innerHTML =
		`<section class="header">
			<p class="y">
				${year}<a onclick="changeYear(-1)">-</a><a onclick="changeYear(1)">+</a>
			</p>
			<p class="p">${yearProgress(year)}</p>
		</section>`
}

// lists detailed logs for a given day
const updateLogs = () => {

	let html = ''
	let keys = Object.keys(localStorage)
	let hours = 0

	keys = keys.filter(
		// compares the calendar date (before T23:00:00...) of each Date() object
		// via https://stackoverflow.com/questions/4607745/
		key => new Date(key).toISOString().split(/T(.+)/)[0] === selectedDay.toISOString().split(/T(.+)/)[0]
	)

	keys.forEach(key => {
		const res = JSON.parse(localStorage.getItem(String(key)))
		hours += parseInt(res.hours)
		html += `<tr class="log-detail">
			<td class="cat ${res.category || 'null'}">[${res.category || 'null'}]</td>
			<td class="hours">${res.hours} -</td>
			<td class="name">${res.project} - ${res.task}</td>
			<td class="time">${res.tod || new Date(res.date).toTimeString().split(' ')[0]}</td>
		</tr>`
	})

	document.getElementById('meta-root').innerHTML =
		`<table>
			<thead>
  			<tr>
   				<th colspan="3">${keys.length > 0 ? hours + ' hours recorded' : 'No records'}</th>
				</tr>
			</thead>
			<tbody>
				${html}
			</tbody>
		</table>`
}

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

setHeader()
