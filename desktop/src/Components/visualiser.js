class Visualiser {
	constructor({ root = null }) {
		this.state = {
			year: new Date().getFullYear(),
			scale: 4, // 12 months / [scale] => 3 months
			root,
			strings: locales('logform')
		}

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

		console.log(scale())


		const query = `?${scale()}&exclude=id,comment,task`
		const data = await fetch(window.api + query).then(r => r.json())
		let svg = ''

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

			let dt1 = new Date(day.date);
			let dt2 = new Date();
			console.log(diff_hours(dt1, dt2));



			return `<rect x="${x}" y="${y}" width="${day.hours}" height="4" rx="10" fill="#eee"/>`
		}

		data.records.forEach(element => {
			svg += day(element)
		})

		// via https://stackoverflow.com/questions/52898456/
		const mode = a =>
			Object.values(
				a.reduce((count, e) => {
					if (!(e in count)) {
						count[e] = [0, e]
					}

					count[e][0]++
					return count
				}, {})
			).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];

		// most commonly entered time of day for work
		const modalTod = `Mode: ${mode(data.records.map(item => item.tod))}`

		this.state.root.innerHTML = `
			<section id="visualiser">
				<svg viewBox="0 0 600 105">
					${svg}
				</svg>
				<p class="vis-meta">${modalTod}</p>
			</section>
		`
	}
}
