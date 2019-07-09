class Visualiser {
	constructor({ root = null }) {
		this.state = {
			year: new Date().getFullYear(),
			scale: 4, // 12 months / [scale] => 3 months
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

		this.state.meta.addEventListener('click', () => this.setScale( ((this.state.scale + 1) % 13) || 1))


		this.render()
	}

	setYear(year) {
		this.state.container.className = ''
		this.state.year = year
		this.render()
	}

	setScale (scale) {
		this.state.container.className = ''
		this.state.scale = scale
		this.render()
	}

	async render () {
		// silently fail if no API provided
		if (!window.api) return

		// defines the query to be sent according to scaled view over time
		const scale = () => {
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
				case 1: return `filter=date,sw,${this.state.year}` // whole year
				case 2: return monthsBack(6)
				case 3: return monthsBack(4)
				case 4: return monthsBack(3)
				case 5:
				case 6: this.state.scale = 6; return monthsBack(2)
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
					this.state.scale = 12
					return `filter=date,sw,${SQLDate(new Date(this.state.year, new Date().getMonth())).slice(0, 7)}`
			}
		}

		// construct a single log <rect />
		const day = day => {
			let y = 0

			const s1s = this.state.strings.s1.values

			// determine y given svg viewBox height of 105
			switch (day.tod) {
				case s1s[0].abbr: y = 10; break // in the early morning
				case s1s[1].abbr: y = 20; break // in the morning
				case s1s[2].abbr: y = 30; break // around midday
				case s1s[3].abbr: y = 40; break // in the afternoon
				case s1s[4].abbr: y = 50; break // in the evening
				case s1s[5].abbr: y = 60; break // around nighttime
				case s1s[6].abbr: y = 70; break // well past sundown
			}

			// TODO: fix the X positioning, reply to FB folk
			// x = date relative scale
			// width = day.hours relative scale => what about nights?

			function diff_hours(dt2, dt1) {
				let diff = (dt2.getTime() - dt1.getTime()) / 1000
				diff /= (60 * 60)
				return Math.abs(Math.round(diff))
			}

			/**
			 * 1. find furthest date
			 * 2. convert that date into hours from present (diff_hours())
			 * 3. day.hours / 2392 = width / 600 => width
			 */


			const totalHours = diff_hours(new Date(), furthest)
			const width = (day.hours / totalHours) * 600 * 20
			const x = 600 - diff_hours(new Date(day.date), furthest) / 600

			return `<rect x="${x}" y="${y}" width="${width}" height="3" rx="1.5" fill="#eee" class="${day.category}"/>`
		}

		// Query database for logs in date range
		const query = `?${scale()}&exclude=id,comment,task`
		const data = await fetch(window.api + query).then(r => r.json())

		scale()

		// determine positioning variables
		const furthest = new Date(
			this.state.year,
			new Date().getMonth() - (12 / this.state.scale) || 11
		)

		console.log(furthest,
			new Date().getMonth() + ' - ' +  ((12 / this.state.scale) )
		)

		let svg = ''

		// create demarcation lines
		for (let i = 0; i < 12 / this.state.scale; i++) {
			const x = i * (600 / this.state.scale) -1
			svg += `<line x1="${x}" x2="${x}" y1="0" y2="100" stroke="var(--b-high)" style="opacity: 0.2"/>`
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
		const modalTod = `Scale: 12/${this.state.scale}. Mode: ${mode(data.records.map(item => item.tod))}.<br>
		From ${SQLDate(furthest).slice(0, 10)} to ${SQLDate().slice(0, 10)}`

		this.state.container.className = 'ready'
		this.state.svg.innerHTML = svg
		this.state.meta.innerHTML = modalTod
	}
}
