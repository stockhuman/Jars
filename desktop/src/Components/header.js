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
			logo: null,
			greeting: null
		}

		this.strings = locales('header')

		this.mount()
		this.render()
	}

	mount () {
		// create overall container
		const container = document.createElement('section')
		container.className = 'header'

		// create logo and greeting container
		const logogreet = document.createElement('header')
		logogreet.className = 'fraction-container'

		this.elem.greeting = document.createElement('div')
		this.elem.greeting.className = 'greeting'
		this.elem.logo = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		this.elem.logo.setAttributeNS(null, 'viewBox', "0 0 128 128")

		// create container for year + buttons
		const yearContainer = document.createElement('p')
		yearContainer.className = 'year'

		// create individual container for buttons
		const buttons = document.createElement('span')
		this.elem.year = document.createElement('span')
		this.elem.year.className = 'year-span'

		// create buttons
		this.btns.ff = document.createElement('a')
		this.btns.ff.innerHTML = '+'
		this.btns.rw = document.createElement('a')
		this.btns.rw.innerHTML = '-'

		// add buttons to local container
		buttons.appendChild(this.btns.rw)
		buttons.appendChild(this.btns.ff)

		// add container and year
		yearContainer.appendChild(buttons)
		yearContainer.appendChild(this.elem.year)

		// create subtitle
		this.elem.subtitle = document.createElement('p')

		// create container to subtitle and year changer
		const yearControls = document.createElement('div')
		yearControls.className = 'year-controls'


		// tie everything together
		logogreet.appendChild(this.elem.logo)
		logogreet.appendChild(this.elem.greeting)

		yearControls.appendChild(yearContainer)
		yearControls.appendChild(this.elem.subtitle)

		container.appendChild(logogreet)
		container.appendChild(yearControls)

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

	fraction () {
		const formatTime = time => Math.ceil(time / (1000 * 3600 * 24))

		// compute how long I have to live
		let birth = new Date(localStorage.getItem('dob'))
		let death = new Date(birth.getFullYear() + 80, birth.getMonth(), birth.getDate())

		let DDC = formatTime(death) - formatTime(birth) // formatted to 29000
		let life = formatTime(new Date(Date.now()).getTime()) - formatTime(birth)

		return life + ' / ' + DDC
	}

	greeting () {
		let hr = new Date().getHours()
		let msg = ''

		switch (hr) {
			case 3:
			case 4: msg = this.strings.greetings[0]
				break
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10: msg = this.strings.greetings[1]
				break
			case 11:
			case 12: msg = this.strings.greetings[2]
				break
			case 13:
			case 14:
			case 15:
			case 16: msg = this.strings.greetings[3]
				break
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22: msg = this.strings.greetings[4]
				break
			case 23:
			case 0:
			case 1:
			case 2: msg = this.strings.greetings[5]
				break
		}
		return msg
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
		this.elem.logo.innerHTML =
			`<circle id="base" cx="64" cy="64" r="64" fill="#FFFFFF"/>
			<clipPath id="clippath">
				<rect  width="${eval(this.fraction() || 0) * 100}" height="128"/>
			</clipPath>
			<circle id="clip" fill="var(--f-high)" cx="64" cy="64" r="64" style="clip-path:url(#clippath);"/>`
		this.elem.greeting.innerHTML =
			`<div>${this.greeting()}</div>
				<span className="fraction">
				${ this.fraction()} - ${this.strings.fraction}
			 </span>`
	}
}
