// TODO: hardcoded strings
const _scales = [
	'a year',
	'half a year',
	'four months',
	'three months',
	'this month'
]

class Visualiser {
	constructor({ root = null }) {
		this.state = {
			year: new Date().getFullYear(),
			scale: 2,
			root,
			strings: locales('logform'),
			svg: null,
			meta: null,
			container: null
		}

		// 'mount'
		this.state.container = document.createElement('section')
		this.state.container.id = 'visualiser'

		this.state.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		this.state.svg.setAttributeNS(null, 'viewBox', '0 0 600 105')

		this.state.meta = document.createElement('p')
		this.state.meta.className = 'vis-meta'

		// tie it together
		this.state.container.appendChild(this.state.svg)
		this.state.container.appendChild(this.state.meta)
		this.state.root.appendChild(this.state.container)

		this.state.meta.addEventListener('click', () => this.setScale( this.state.scale + 1))

		this.render()
	}

	setYear(year) {
		this.state.container.className = ''
		this.state.year = year
		this.render()
	}

	setScale (scale) {
		this.state.container.className = ''
		this.state.scale = scale % _scales.length
		this.render()
	}

	async render () {
		// silently fail if no API provided
		if (!window.api) return

		// defines the query to be sent according to scaled view over time
		const makeQuery = () => {
			const monthsBack = months => {
				let str = ''
				for (let i = 0; i < months; i++) {
					let mon = String(new Date().getMonth() + 1 - i)
					// see https://github.com/mevdschee/php-crud-api#multiple-filters
					str += `&filter${i + 1}=date,sw,${this.state.year}-${mon.padStart(2, 0)}`
				}
				return str
			}

			switch (this.state.scale) {
				case 0: return `filter=date,sw,${this.state.year}` // whole year
				case 1: return monthsBack(6)
				case 2: return monthsBack(4)
				case 3: return monthsBack(3)
				case 4:
					return `filter=date,sw,${SQLDate(
						new Date(
							this.state.year,
							new Date().getMonth()
						)).slice(0, 7)
						}`
			}
		}

		// returns distance in days
		const dist = (a, b) => Math.abs(Math.round(((a - b) / (1000 * 60 * 60 * 24))))

		// construct a single log <rect />
		const day = day => {
			let y = 0
			let x = ratio * dist(furthest, new Date(day.date))
			let w = ratio * day.hours

			// determine y given svg viewBox height of 105
			switch (day.tod) {
				case todstrs[0].abbr: y = 10; break // in the early morning
				case todstrs[1].abbr: y = 20; break // in the morning
				case todstrs[2].abbr: y = 30; break // around midday
				case todstrs[3].abbr: y = 40; break // in the afternoon
				case todstrs[4].abbr: y = 50; break // in the evening
				case todstrs[5].abbr: y = 60; break // around nighttime
				case todstrs[6].abbr: y = 70; break // well past sundown
			}

			return `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" class="${day.category}"/>`
		}

		// Query database for logs in date range
		const query = `?${makeQuery()}&exclude=id,comment,task`
		const data = await fetch(window.api + query).then(r => r.json())
		const todstrs = this.state.strings.s1.values

		let svg = ''
		let fmonth = new Date().getMonth()
		let furthest

		switch (this.state.scale) {
			case 0: furthest = new Date(this.state.year, fmonth - 12); break
			case 1: furthest = new Date(this.state.year, fmonth - 6); break
			case 2: furthest = new Date(this.state.year, fmonth - 4); break
			case 3: furthest = new Date(this.state.year, fmonth - 3); break
			case 4: furthest = new Date(this.state.year, fmonth); break
		}

		let ratio = 600 / dist(furthest, new Date())

		// create 'time of day' labels
		for (let i = 0; i < 7; i++) {
			svg += `<text x="0" y="${i * 10 + 15}">${todstrs[i].abbr}</text>`
		}

		// append logs to svg
		data.records.forEach( el => svg += day(el) )

		// discover modal time of day
		// via https://stackoverflow.com/questions/52898456/
		const mode = a => {
			return Object.values(
				a.reduce((count, e) => {
					if (!(e in count)) count[e] = [0, e]
					count[e][0]++
					return count
				}, {})
			).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1]
		}

		// most commonly entered time of day for work
		const modalTod =
			`Scale: ${_scales[this.state.scale]}. Mode: ${mode(data.records.map(item => item.tod))}.`

		this.state.container.className = 'ready'
		this.state.svg.innerHTML = svg
		this.state.meta.innerHTML = modalTod
	}
}
