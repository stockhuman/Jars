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


		this.render()
	}

	setYear(year) {
		this.state.year = year
		this.render()
	}

	setScale (scale) {
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
				case 12:
					let yr = this.state.year
					return `sw,${yr}-${new Date(yr, new Date().getMonth())}`
			}
		}

		// Query database for logs in date range
		const query = `?${scale()}&exclude=id,comment,task`
		const data = await fetch(window.api + query).then(r => r.json())
		let svg = ''

		// construct a single log <rect />
		const day = day => {
			let y = 0
			let x = 0

			const s1s = this.state.strings.s1.values

			// determine y given svg viewBox height of 105
			switch (day.tod) {
				case s1s[0].abbr: y = 10; break // in the early morning
				case s1s[1].abbr: y = 25; break // in the morning
				case s1s[2].abbr: y = 40; break // around midday
				case s1s[3].abbr: y = 55; break // in the afternoon
				case s1s[4].abbr: y = 70; break // in the evening
				case s1s[5].abbr: y = 85; break // around nighttime
				case s1s[6].abbr: y = 100; break // well past sundown
			}

			// TODO: fix the X positioning, reply to FB folk
			// x = date relative scale
			// width = day.hours relative scale => what about nights?

			function diff_hours(dt2, dt1) {

				var diff = (dt2.getTime() - dt1.getTime()) / 1000;
				diff /= (60 * 60);
				return Math.abs(Math.round(diff));

			}


			/**
			 * 1. find furthest date
			 * 2. convert that date into hours from present (diff_hours())
			 * 3. last / present = day.hours / 600 => width
			 */

			const furthest = new Date(this.state.year, new Date().getMonth() - (12 / this.state.scale))
			console.log(diff_hours(new Date(), furthest))


			return `<rect x="${x}" y="${y}" width="${day.hours}" height="4" rx="10" fill="#eee"/>`
		}

		// append logs to svg
		data.records.forEach( el=> svg += day(el) )

		// discover modal time of day
		// via https://stackoverflow.com/questions/52898456/
		const mode = a =>
			Object.values(
				a.reduce((count, e) => {
					if (!(e in count)) count[e] = [0, e]
					count[e][0]++
					return count
				}, {})
			).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];

		// most commonly entered time of day for work
		const modalTod = `Mode: ${mode(data.records.map(item => item.tod))}`

		this.state.container.className = 'ready'
		this.state.svg.innerHTML = svg
		this.state.meta.innerHTML = modalTod
	}
}
