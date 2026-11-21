class Query extends Module {
	constructor (props) {
		super(props)
		this.state = {
			year: new Date().getFullYear(),
			modified: [],
			placeholder: 'Lookup by project name',
			inputValue: '',
			data: []
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

	setData (data) {
		this.state.data = data
		this.render()
	}

	updateInputValue (event) {
		if (event.target) {
			this.setState({ inputValue: event.target.value })
		}
	}

	createQuery() {
		return `?&filter=project,eq,${encodeURIComponent(this.state.inputValue)}`
	}

	events () {
		this.input.addEventListener('change', event => {
			this.updateInputValue(event)
		})

		this.input.addEventListener('keyup', event => {
			if (event.key === 'Enter') {
				const q = this.createQuery()
				let e = new CustomEvent('query-request', { detail: q })
				document.dispatchEvent(e)
			}
		})
	}

	// This method adapts a similar one seen in Visualiser.js
	render () {
		// display nearest logs first (copy, so re-renders don't flip the order back)
		const data = [...this.state.data].reverse()
		this.results.innerHTML = `<p class="loading">Loading...</p>`

		const container = elem('div', {className: 'editor-log-list'})

		// tally total hours selected
		let hours = 0

		data.forEach(l => {
			// create individual, editable portions of each log
			const li = elem('div', { className: 'editor-log' })

			const parts = {
				id: elem('span', { textContent: l.ID ? ("0000" + l.ID).substr(-4, 4) : '', className: 'id' }), // local logs have no ID
				date: elem('span', { textContent: l.date, className: 'date' }),
				hours: elem('span', { textContent: l.hours, className: 'hours' }),
				proj: elem('span', { textContent: l.project, className: 'project' }),
				tod: elem('span', { textContent: l.tod, className: 'tod' }),
				task: elem('span', { textContent: l.task, className: 'task' }),
				cat: elem('span', { textContent: l.category, className: 'category' }),
				comment: elem('span', { textContent: l.comment, className: 'comment' })
			}

			hours += parseFloat(l.hours)

			Object.values(parts).forEach(el => {
				li.appendChild(el)
			})

			container.appendChild(li)
		})

		hours = Math.round(hours * 100) / 100 // 1.1 + 2.2 is 3.3000000000000003
		this.results.innerHTML =
			`<h3>${data.length} log${data.length==1?'':'s'} selected - ${hours} hour${hours==1?'':'s'}</h3>`
		this.results.appendChild(container)
		this.results.classList = 'loaded'
	}
}
