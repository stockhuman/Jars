class Query extends Module {
	constructor (props) {
		super(props)
		this.state = {
			year: new Date().getFullYear(),
			modified: [],
			placeholder: '',
			inputValue: '',
		}

		// build out element programmatically
		let container = elem('section', { className: 'log' })

		// live update
		this.preview = elem('div', { className: 'live-update' })
		container.appendChild(this.preview)

		this.results = elem('section', {className: 'results'})
		this.root.prepend(this.results)

		// logger
		this.input = elem('input')
		this.setAttributes(this.input, {
			type: 'text',
			class:'log-input',
			id: 'log',
			autoComplete: 'off',
			value: this.state.inputValue,
			placeholder: this.state.placeholder
		})
		container.appendChild(this.input)
		this.root.appendChild(container)
		this.events()
		this.render()
	}

	alter (data) {
		data.id.style.color = '#F29E74'
		this.state.closebtn.innerHTML = 'update'
		this.state.modified[Number(data.id.innerHTML)] = {
			category: data.cat.innerHTML,
			comment: data.comment.innerHTML,
			date: data.date.innerHTML,
			hours: data.hours.innerHTML,
			project: data.proj.innerHTML,
			task: data.task.innerHTML,
			tod: data.tod.innerHTML
		}
	}

	confirm (id, log) {
		console.log(`Updated log #${id} with fields:`, log)

		fetch(`${window.api}/${id}` , {
			method: 'PUT',
			// 	mode: 'cors', // no-cors, cors, *same-origin
			// 	credentials: 'same-origin', // include, *same-origin, omit
			headers: { 'Content-Type': 'application/json' },
			referrer: 'no-referrer',
			body: JSON.stringify(log),
		})
		.then(response => console.log(response.json()))
	}

	createQuery() {
		return `?&filter=ID,eq,4`
	}

	events () {
		this.input.addEventListener('keyup', event => {
			if (event.key === 'Enter') {
				const q = this.createQuery()
				let e = new CustomEvent('query-request', { detail: q })
				document.dispatchEvent(e)
			}
		})
	}

	// This method adapts a similar one seen in Visualiser.js
	render (data = []) {
		this.results.innerHTML = `<p class="loading">Loading...</p>`


		// defines the query to be sent according to scaled view over time
		let d = new Date()
		let start = YYYYMMDD(new Date(d.getFullYear(), d.getMonth() - 3, 0))
		let end = YYYYMMDD()
		// this is v2 date formatting, each date stored as an int
		// see https://github.com/mevdschee/php-crud-api#filters
		// Query database for logs in date range


		data.reverse() // display nearest logs first

		const container = elem('div', {className: 'editor-log-list'})

		data.forEach(l => {
			// create individual, editable portions of each log
			const li = elem('div', { className: 'editor-log' })

			const parts = {
				id: elem('span', { innerHTML: ("0000" + l.ID).substr(-4, 4), className: 'id' }),
				date: elem('span', { contentEditable: true, innerHTML: l.date, className: 'date' }),
				hours: elem('span', { contentEditable: true, innerHTML: l.hours, className: 'hours' }),
				proj: elem('span', { contentEditable: true, innerHTML: l.project, className: 'project' }),
				tod: elem('span', { contentEditable: true, innerHTML: l.tod, className: 'tod' }),
				task: elem('span', { contentEditable: true, innerHTML: l.task, className: 'task' }),
				cat: elem('span', { contentEditable: true, innerHTML: l.category, className: 'category' }),
				comment: elem('span', { contentEditable: true, innerHTML: l.comment, className: 'comment' })
			}

			Object.values(parts).forEach(el => {
				li.appendChild(el)
				el.addEventListener('input', () => this.alter(parts))
			})

			container.appendChild(li)
		})

		this.results.innerHTML = `<h3>${data.length} logs from ${start} - ${end}</h3>`
		this.results.appendChild(container)
		this.results.classList = 'loaded'
	}
}
