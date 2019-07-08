function filterFloat(value) {
	if (value.startsWith('.')) value = '0' + value
	if ((/^(\|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/).test(value)) {
		return Number(value)
	} else {
		return NaN
	}
}

function SQLDate(date = new Date()) {
	// convert date string to the 'YYYY-MM-DD HH:MM:SS' SQL format
	return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
}

function YYYYMMDD (date = new Date()) {
	return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}


class LogForm {
	constructor ({ root = null }) {
		this.state = {
			root,
			strings: locales('logform'),
			placeholder: 'log time',
			inputValue: '',
			summary: '',
			stage: 0,
			commit: {},
			customDate: null
		}

		// build out element programmatically
		let container = document.createElement('section')
		container.className = 'log'

		// live update
		this.preview = document.createElement('div')
		this.preview.className = 'live-update'
		container.appendChild(this.preview)

		// logger
		this.input = document.createElement('input')
		this.setAttributes(this.input, {
			type: 'text',
			class:'log-input',
			id: 'log',
			autoComplete: 'off',
			value: this.state.inputValue,
			placeholder: this.state.placeholder
		})
		container.appendChild(this.input)
		this.state.root.appendChild(container)

		this.render()
		this.events()
	}

	setAttributes(element, attributes) {
		Object.keys(attributes).forEach(name => {
			element.setAttribute(name, attributes[name])
		})
	}

	// shim for native non-react code
	setState (props) {
		this.state = { ...this.state, ...props }
		this.render()
	}

	alterDate (newDate) {
		const d = YYYYMMDD(newDate)
		const isToday = d.getTime() == YYYYMMDD().getTime()

		if (!isToday) {
			// date passed is not the current date
			this.setState({ ...this.state, customDate: d})
			this.setAttributes(this.input, {
				class: 'log-input altered-date'
			})
		} else {
			this.setState({ ...this.state, customDate: null })
			this.setAttributes(this.input, {
				class: 'log-input'
			})
		}
	}

	appendTime (hours) {
		if (hours < 1) {
			hours = 60 * hours
			hours += ' ' + this.state.strings.s0.minutes
		} else if (hours === 1) {
			hours += ' ' + this.state.strings.s0.singularHourNoPronoun
		} else {
			hours += ' ' + this.state.strings.s0.singularHour
		}
		return hours
	}

	updateInputValue (event) {
		if (event.target) {
			this.setState({ inputValue: event.target.value })
		}
	}

	events () {
		let strings = this.state.strings
		let l = this.input

		l.addEventListener('blur', () => {
			this.setState({ stage: 0 })
			this.updateInputValue('')
			this.setState({
				placeholder: strings.misc.placeholder,
				summary: '',
				stage: 0
			})
		})

		l.addEventListener('change', event => {
			this.updateInputValue(event)
		})

		l.addEventListener('focus', () => {
			this.setState({ placeholder: strings.misc.begin })
		})

		l.addEventListener('keyup', event => {
			if (event.key === 'Enter') {
				switch (this.state.stage) {
					case 0: // amount worked
						this.setState({
							placeholder: strings.s0.placeholder,
							commit: { ...this.state.commit, hours: this.state.inputValue}
						})
						if (!isNaN(filterFloat(this.state.inputValue))) {
							if (this.state.inputValue === '1') {
								this.setState({
									summary: `${strings.s0.singularHour} `
								})
							} else {
								this.setState({
									summary: `${this.state.inputValue} ${strings.s0.pluralHour} `
								})
							}
						} else this.input.blur()
						break;
					case 1: // time of day
						const s1s = strings.s1 // alias stage 1 strings
						let humanTOD = '' // TOD == time of day

						switch (this.state.inputValue) {
							case s1s.values[0].abbr: // 'in the early morning'
								humanTOD = s1s.values[0].expa
								break
							case s1s.values[1].abbr: // 'in the morning'
								humanTOD = s1s.values[1].expa
								break
							case s1s.values[2].abbr: // 'around midday'
								humanTOD = s1s.values[2].expa
								break
							case s1s.values[3].abbr: // 'in the afternoon'
								humanTOD = s1s.values[3].expa
								break
							case s1s.values[4].abbr: // 'in the evening'
								humanTOD = s1s.values[4].expa
								break
							case s1s.values[5].abbr: // 'around nighttime'
								humanTOD = s1s.values[5].expa
								break
							case s1s.values[6].abbr: // 'well past sundown'
								humanTOD = s1s.values[6].expa
								break
							default: // if something else (or nothing) is input,
								if (this.state.inputValue === '') {
									// return 'HH:MM:SS'
									humanTOD = `@ ${new Date().toTimeString().split(' ')[0]}`
								} else {
									// or what was input
									humanTOD = `<b>${this.state.inputValue}</b>`
								}
						}

						this.setState({
							placeholder: s1s.placeholder, // 'project'
							summary: this.state.summary + `${humanTOD} ${s1s.transition} `,
							commit: { ...this.state.commit, tod: this.state.inputValue }
						})
						break;
					case 2: // project value
						this.setState({
							placeholder: strings.s2.placeholder, // 'task
							summary: `${this.state.summary + this.state.inputValue} => `,
							commit: { ...this.state.commit, project: this.state.inputValue }
						})
						break;
					case 3: // task value
						this.setState({
							placeholder: strings.s3.placeholder,
							summary: `${this.state.summary + this.state.inputValue}. (${strings.s3.category}: `,
							commit: { ...this.state.commit, task: this.state.inputValue }
						})
						break;
					case 4: // category
						this.setState({
							placeholder: strings.s4.placeholder,
							summary: this.state.summary + this.state.inputValue + ') ',
							commit: { ...this.state.commit, category: this.state.inputValue }
						})
						break;
					case 5: // comment
						this.setState({
							placeholder: strings.s5.placeholder,
							commit: { ...this.state.commit, comment: this.state.inputValue }
						})
						if (this.state.inputValue !== '') {
							this.setState({
								summary: `${this.state.summary} ${strings.s5.comment}: ${this.state.inputValue}`
							})
						}
						break;

					default:
						break;
				}

				// advance stages!
				if (this.state.stage <= 5) {
					this.setState({
						inputValue: '',
						stage: this.state.stage + 1
					})
					console.log('now on stage ' + this.state.stage)
				} else {

					// set appropriate date
					if (this.state.customDate) {
						this.state.commit.date = SQLDate(this.state.customDate)
					} else {
						this.state.commit.date = SQLDate()
					}

					// commit!
					if (window.api) {
						fetch(window.api, {
							method: 'POST',
							mode: 'no-cors',
							credentials: 'omit',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(this.state.commit)
						})
						.then(() => {
							let e = new CustomEvent('commit', { detail: this.state.commit })
							document.dispatchEvent(e)
						}).catch(() => alert('Failed to commit bean'))
					} else {
						// save locally
						localStorage.setItem(this.state.commit.date, JSON.stringify(this.state.commit))
						let e = new CustomEvent('commit', { detail: this.state.commit })
						document.dispatchEvent(e)
					}

					// reset
					this.setState({
						placeholder: strings.success,
						summary: '',
						commit: {}
					})

					// blurs() the input, returning focus to the main window
					setTimeout(() => {
						this.input.blur()
					}, 2000)
				}
			} else if (event.key === 'Escape') {
				l.blur()
			}
		})
	}

	render() {
		this.preview.innerHTML = this.state.summary
		this.input.value = this.state.inputValue
		this.input.placeholder = this.state.placeholder
	}
}
