/**
 * MIT License
 *
 * Copyright (c) 2018 Alexey Botkov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

const dayNames = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
]

class Calendar {

	constructor({ root = null, year = new Date().getFullYear()}) {
		let t = new Date()
		let today = new Date(t.getFullYear(), t.getMonth(), t.getDate() -1, 0)

		this.state = {
			root,
			year,
			today
		}
		this.listeners = []

		// 'mount' component
		this.state.root.innerHTML = `<section id="calendar">${this.render()}</section>`
		this.events() // hook events
	}

	_labels() {
		let html = ''
		let y = 0

		for (let i = 0; i < 7; i++) {
			y = (i * 14);
			html += `<text class='dayLabel' x='5' y='${y}' dy='10'>${dayNames[i].substr(0, 1)}</text>`
		}
		return html
	}

	_month(month) {
		let html = ''
		let monthLength = new Date(this.state.year, month + 1, 0).getDate()
		let date = 0
		let x = 0
		let y = 0


		while (date < monthLength) {
			x += 14
			let week = 0

			while (week < 7 && date != monthLength) {
				y = week * 14
				let day = new Date(this.state.year, month, date, 0)
				let style = ''
				let tabIndex = `tabIndex="0"`

				if (day.getDay() != week) {
					tabIndex = ''
					style = 'null'
					date--
				} else if (String(day) == String(this.state.today)) style = 'today'
				else if (day < this.state.today) style = 'gone'
				else if (day.getDay() == 5 || day.getDay() == 6) style = 'weekend'
				else style = 'day'

				html += `<rect class="${style}" x="${x}" y="${y}" width='12px' height='12px' rx='2' ry='2'
				details="${new Date(this.state.year, month, date + 1)}" ${tabIndex} />`
				week++
				date++
			}
		}
		return html
	}

	_emit (event, type = 'select') {
		let e = new CustomEvent(`calendar-${type}`, { detail: event.target.date } )
		document.dispatchEvent(e)
	}

	events () {
		const days = document.querySelectorAll(".graph rect:not(.null)")
		days.forEach(day => {
			day.date = day.attributes.details.value
			this.listeners.push(day)
			day.addEventListener('focus', (e) => this._emit(e))
			day.addEventListener('blur', (e) => this._emit(e, 'blur'))
		})
	}

	setYear(year) {
		this.state.year = year
		this.state.root.innerHTML = `<section id="calendar">${this.render()}</section>`
		this.listeners = []
		this.events()
	}

	render() {
		let month = 0
		let html = ''

		while (month < 12) {
			html += `<div class='month'>
					<p class='m'>${monthNames[new Date(this.state.year, month).getMonth()].substr(0, 3)}</p>
					<svg class='graph' id="${monthNames[month]}">
						${this._labels()}
						${this._month(month)}
					</svg>
				</div>`
			month++
		}

		return html
	}
}
