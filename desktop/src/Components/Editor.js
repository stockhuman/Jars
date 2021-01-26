class Editor extends Module {
	constructor (props) {
		super(props)
		this.state = {
			year: new Date().getFullYear(),
			modified: []
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
		if (this.state.modified.length > 0) {
			
			this.state.modified.forEach((log, id) => this.confirm(id, log))
			this.state.closebtn.innerHTML = 'close'
			this.state.modified = []
		}
		this.state.pill.classList = 'closed'
		this.root.style.display = 'none'
		this.root.classList = ''
		this.state.closebtn.style.display = 'none'
	}

	// to save on data, best keep most of this in memory
	show () {
		this.state.pill.classList = ''
		this.root.style.display = 'block'
		this.root.classList = 'loaded'
		this.state.closebtn.style.display = 'block'
	}

	alter (data) {
		data.id.style.color = '#F29E74'
		this.state.closebtn.innerHTML = 'update'

		let log = {
			category: data.cat.innerHTML,
			comment: data.comment.innerHTML,
			date: data.date.innerHTML,
			hours: data.hours.innerHTML,
			project: data.proj.innerHTML,
			task: data.task.innerHTML,
			tod: data.tod.innerHTML
		}

		if (window.store == 'CRUD') {
			this.state.modified[Number(data.id.data)] = log
		} else if (window.store == 'local') {
			this.state.modified[data.id.data] = {...log, key: data.id.data}
		}
	}

	confirm (id, log) {
		console.log(`Updated log #${id} with fields:`, log)
		window.storage.update(id, log)
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
		const data = await window.storage.get(query)

		data.reverse() // display nearest logs first

		const container = elem('section', {className: 'editor-log-list'})

		data.forEach(l => {
			// create individual, editable portions of each log
			const li = elem('div', { className: 'editor-log' })
			const uid = window.store == 'CRUD' ? l.ID : l.id

			const parts = {
				id: elem('span', { innerHTML: ("0000" + uid).substr(-4, 4), className: 'id', data: uid }),
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

		this.root.innerHTML = `<h3>${data.length} log${data.length==1?'':'s'} from ${start} - ${end}</h3>`
		this.root.appendChild(container)
		this.root.classList = 'loaded'
	}
}
