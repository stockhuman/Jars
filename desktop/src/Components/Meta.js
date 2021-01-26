class Meta extends Module {
	constructor(props) {
		super(props)
	}

	// lists detailed logs for a given day
	async render(selectedDay) {
		let html = ''
		let hours = 0
		let records = []

		if (window.api && window.store != 'local') {
			// imediately set a 'loading' text
			this.root.innerHTML = 'fetching...'

			// see https://github.com/mevdschee/php-crud-api
			let query = `?filter=date,eq,${YYYYMMDD(selectedDay)}`
			let db = await fetch(window.api + query).then(r => r.json()).catch(() => [])

			if (db && db.records.length > 0) {
				records = db.records
			}

		} else {
			let keys = Object.keys(localStorage)
			keys = keys.filter(key => key.startsWith(YYYYMMDD(selectedDay)))
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
			<span class="time">${res.tod}</span>
		</div>`
		})


		this.root.innerHTML =
			`<div class="meta-table">
				<header>
					${records.length > 0 ? hours + ' hour' + (hours == 1 ? '' : 's') + ' recorded' : 'No records'}
				</header>
				<div class="meta-table-body">
					${html}
				</div>
			</div>`
	}
}
