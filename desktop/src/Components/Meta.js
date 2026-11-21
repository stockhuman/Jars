class Meta extends Module {
	constructor(props) {
		super(props)
	}

	// lists detailed logs for a given day
	async render(selectedDay) {
		let html = ''
		let hours = 0
		let records = []

		// imediately set a 'loading' text
		this.root.innerHTML = 'fetching...'

		// see https://github.com/mevdschee/php-crud-api
		let query = `?filter=date,eq,${YYYYMMDD(selectedDay)}`
		let db = await window.storage.get(query)

		if (db && db.length > 0) {
			records = db
		}

		records.forEach(res => {
			const cat = escapeHTML(res.category || 'null')
			hours += filterFloat(res.hours)
			html += `<div class="log-detail">
			<span class="cat ${cat}">[${cat}]</span>
			<span class="hours">(${escapeHTML(res.hours)}) </span>
			<span class="name">${escapeHTML(res.project)} - ${escapeHTML(res.task)}</span>
			<span class="time">${escapeHTML(res.tod)}</span>
		</div>`
		})
		hours = Math.round(hours * 100) / 100 // 1.1 + 2.2 is 3.3000000000000003


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
