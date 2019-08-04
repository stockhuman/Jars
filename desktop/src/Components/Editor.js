class Editor extends Module {
	constructor (props) {
		super(props)
		this.state = {
			year: new Date().getFullYear()
		}
		this.pill(props.click.x, props.click.y)
		this.render()
	}

	pill (x, y) {
		let e = elem('div', { id: 'editor-pill' })
		e.setAttribute('style', `top: ${y}px; left: ${x}px`)
		document.body.appendChild(e)
		this.state.pill = e

		let close = elem('p', { innerHTML: 'close', id: 'editor-close'})
		close.addEventListener('click', () => this.hide())
		document.body.appendChild(close)
		this.state.closebtn = close
	}

	hide () {
		this.state.pill.classList = 'closed'
		this.root.style.display = 'none'
		this.state.closebtn.style.display = 'none'
	}

	// to save on data, best keep most of this in memory
	show () {
		this.state.pill.classList = ''
		this.root.style.display = 'block'
		this.state.closebtn.style.display = 'block'
	}

	events () {}

	alter (data) {
		console.log(data)
	}

	// This method adapts a similar one seen in Visualiser.js
	async render () {
		this.root.innerHTML = `<p class="loading">Loading...</p>`

		if (!window.api) {
			this.root.innerHTML = `<p class="loading">API not set</p>`
			return
		}

		// defines the query to be sent according to scaled view over time
		let d = new Date()
		let start = YYYYMMDD(new Date(d.getFullYear(), d.getMonth() - 3, 0))
		let end = YYYYMMDD()
		// this is v2 date formatting, each date stored as an int
		// see https://github.com/mevdschee/php-crud-api#filters
		// Query database for logs in date range
		const query = `?$&filter=date,bt,${start},${end}`
		const data = await fetch(window.api + query).then(r => r.json())

		const container = elem('section')

		data.records.forEach(l => {
			// create individual, editable portions of each log
			const li = elem('div', { className: 'editor-log' })
			const config = { attributes: true, childList: true, subtree: true }

			const parts = [
				{ id: elem('span', { innerHTML: ("0000" + l.ID).substr(-4, 4), className: 'id' }) },
				{ date: elem('span', { contentEditable: true, innerHTML: l.date, className: 'date' }) },
				{	hours : elem('span', { contentEditable: true, innerHTML: l.hours, className: 'hours' }) },
				{	proj: elem('span', { contentEditable: true, innerHTML: l.project, className: 'project' }) },
				{ tod: elem('span', { contentEditable: true, innerHTML: l.tod, className: 'tod' }) },
				{ task: elem('span', { contentEditable: true, innerHTML: l.task, className: 'task' }) },
				{ cat: elem('span', { contentEditable: true, innerHTML: l.category, className: 'category' }) },
				{ comment: elem('span', { contentEditable: true, innerHTML: l.comment, className: 'comment' }) }
			]

			parts.forEach(el => {
				const e = Object.values(el)[0]
				li.appendChild(e)
				e.addEventListener('input', () => {this.alter(parts)})
			})

			const observer = new MutationObserver(() => { this.alter(parts) })
			observer.observe(li, config)
			container.appendChild(li)
		})

		this.root.innerHTML = ''
		this.root.appendChild(container)
	}
}
