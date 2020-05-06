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
		return `?&filter=project,eq,${this.state.inputValue}`
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
		const data = this.state.data
		this.results.innerHTML = `<p class="loading">Loading...</p>`

		data.reverse() // display nearest logs first

		const container = elem('div', {className: 'editor-log-list'})

		// tally total hours selected
		let hours = 0

		data.forEach(l => {
			// create individual, editable portions of each log
			const li = elem('div', { className: 'editor-log' })

			const parts = {
				id: elem('span', { innerHTML: ("0000" + l.ID).substr(-4, 4), className: 'id' }),
				date: elem('span', { innerHTML: l.date, className: 'date' }),
				hours: elem('span', { innerHTML: l.hours, className: 'hours' }),
				proj: elem('span', { innerHTML: l.project, className: 'project' }),
				tod: elem('span', { innerHTML: l.tod, className: 'tod' }),
				task: elem('span', { innerHTML: l.task, className: 'task' }),
				cat: elem('span', { innerHTML: l.category, className: 'category' }),
				comment: elem('span', { innerHTML: l.comment, className: 'comment' })
			}

			hours += parseFloat(l.hours)

			Object.values(parts).forEach(el => {
				li.appendChild(el)
			})

			container.appendChild(li)
		})

		this.results.innerHTML =
			`<h3>${data.length} log${data.length==1?'':'s'} selected - ${hours} hours</h3>`
		this.results.appendChild(container)
		this.results.classList = 'loaded'
	}
}
