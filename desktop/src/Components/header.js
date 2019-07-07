class Header {
	constructor ({root = null, year = new Date().getFullYear()}) {
		this.root = root
		this.year = year
		this.btns = {
			ff: null,
			rw: null
		}
		this.elem = {
			subtitle: null,
			year: null,
			logo: null
		}

		this.mount()
		this.render()
	}

	mount () {
		// create overall container
		const container = document.createElement('section')
		container.className = 'header'

		// create container for year + buttons
		const yearContainer = document.createElement('p')
		yearContainer.className = 'year'

		// create individual container for buttons
		const buttons = document.createElement('span')
		this.elem.year = document.createElement('span')

		// create buttons
		this.btns.ff = document.createElement('a')
		this.btns.ff.innerHTML = '+'
		this.btns.rw = document.createElement('a')
		this.btns.rw.innerHTML = '-'

		// add buttons to local container
		buttons.appendChild(this.btns.rw)
		buttons.appendChild(this.btns.ff)

		// add container and year
		yearContainer.appendChild(this.elem.year)
		yearContainer.appendChild(buttons)

		// create subtitle
		this.elem.subtitle = document.createElement('p')

		// tie everything together
		container.appendChild(yearContainer)
		container.appendChild(this.elem.subtitle)

		// mount
		this.root.appendChild(container)

		this._events()
	}

	subtitle () {
		const diff = new Date() - new Date(this.year, 0, 1, 0)
		const progress = ((diff / 31536000000) * 100).toFixed(2)
		const yd = Math.abs((progress / 100).toFixed(2))

		if (progress < 0) {
			return yd + ` YEARS AWAY`
		} else if (progress > 100) {
			return yd + ` YEARS AGO`
		} else {
			return progress + "%"
		}
	}

	changeYear (year) {
		this.year = year
		this._emit()
		this.render()
	}

	_emit () {
		let e = new CustomEvent('year-change', { detail: this.year })
		document.dispatchEvent(e)
	}

	_events () {
		this.btns.ff.addEventListener('click', () => this.changeYear(this.year + 1))
		this.btns.rw.addEventListener('click', () => this.changeYear(this.year - 1))
	}

	render () {
		// only updates values.
		this.elem.year.innerHTML = this.year
		this.elem.subtitle.innerHTML = this.subtitle()
	}
}
