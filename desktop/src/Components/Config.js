class Config {
	constructor (json) {
		this.json = json || this.get()
	}

	init () {
		this.merge()
		this.set()
		this.css()
		this.pollute()
	}

	merge () {
		this.json = { ...this.get(), ...this.json }
	}

	pollute () {
		let { APIurl, dateOfBirth, motto, locale, store } = this.get()

		locale = locale ? locale.toLowerCase() : 'en'

		if (store == 'local') window.store = 'local'
		if (!APIurl) window.store = 'local'
		if (window.store == 'local') {
			localStorage.setItem('store', 'local')
		}

		window.api = APIurl // CRUD endpoint URL
		window.dob = dateOfBirth // used to calculate jars icon
		window.motto = motto // flair
		window.locale = locale // language to use in app

		localStorage.setItem('api', APIurl)
		localStorage.setItem('dob', dateOfBirth)
		localStorage.setItem('locale', locale)

		// function also creates css from css key in LS
		let s = document.createElement('style')
		s.appendChild(document.createTextNode(localStorage.getItem('css')))
		document.head.appendChild(s)
	}

	// creates CSS to dynamically color categories
	css () {
		const { colors } = this.json
		const keys = Object.keys(colors)
		const values = Object.values(colors)

		let css = ''

		keys.forEach((key, i) => {
			// visualiser @v2.1.0
			css += `#visualiser rect.${key}{fill:${values[i]}}`
			// meta (little display under the selected day) @v2.1.0
			css += `.log-detail .cat.${key}{color:${values[i]}}`
		})

		localStorage.setItem('css', css)
	}

	get () {
		return JSON.parse(localStorage.getItem('config')) || {}
	}

	set () {
		localStorage.setItem('config', JSON.stringify(this.json))
	}

}
