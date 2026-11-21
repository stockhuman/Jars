class LogForm extends Module {
	constructor (props) {
		super(props)
		this.state = {
			strings: locales('logform'),
			placeholder: 'log time',
			inputValue: '',
			summary: '',
			stage: 0,
			commit: {},
			customDate: null
		}

		// build out element programmatically
		let container = elem('section', { className: 'log' })

		// live update
		this.preview = elem('div', { className: 'live-update' })
		container.appendChild(this.preview)

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

		this.render()
		this.events()
	}

	// assures that the bean is properly formatted to some degree
	assure () {
		const { date, hours, tod, project, task, category } = this.state.commit
		const possible = (h) => Number(h) != 0 && Number(h) < 24
		if (!isValidAPIDate(date)) return false
		if (isNaN(filterFloat(hours)) || !possible(hours)) return false
		if (tod == '') return false
		if (project == '') return false
		if (task == '') console.warn(`It's nice to log a task with a project`)
		if (category == '') console.warn(`Marking category as null is discouraged`)
		return true
	}

	alterDate (newDate) {
		const d = YYYYMMDD(newDate)
		const isToday = d == YYYYMMDD()

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

	error (message) {
		this.input.classList.add('error')
		this.preview.innerHTML = message
		console.warn(message, this.state.commit)
		setTimeout(() => {
			this.input.blur()
			this.input.classList.remove('error')
		}, 2500)
	}

	// engages the hidden setup menu from the logform
	_setup () {
		this.input.blur()
		let e = new CustomEvent('setup')
		document.dispatchEvent(e)
	}

	_query () {
		let e = new CustomEvent('query')
		document.dispatchEvent(e)
	}

	// puts a bean in perspective: its share of the rest of your life,
	// counted to the same 80 years as the logo in the header
	_receipt (hours) {
		const template = this.state.strings.receipt
		const birth = new Date(localStorage.getItem('dob'))
		const end = new Date(birth.getFullYear() + 80, birth.getMonth(), birth.getDate())
		const hoursLeft = (end - new Date()) / 36e5
		if (!template || !(hoursLeft > 0)) return '' // no birthday, or living on bonus time
		return ' ' + template.replace('{share}', (filterFloat(hours) / hoursLeft * 100).toPrecision(2))
	}

	// it's raining beans
	_beans () {
		this.input.blur()
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return this.error('Imagine it raining beans.')

		const varieties = ['#8a5a44', '#9b2d30', '#c9a27e', '#3b2f2f', '#efe0c8'] // brown, kidney, pinto, black, navy (navy beans are white. look it up)
		for (let i = 0; i < 80; i++) {
			const bean = elem('div', { className: 'bean' })
			bean.style.left = `${Math.random() * 100}vw`
			bean.style.background = varieties[i % varieties.length]
			bean.style.animationDelay = `${Math.random() * 2}s`
			bean.style.animationDuration = `${1.5 + Math.random() * 2}s`
			bean.style.setProperty('--spin', `${Math.round(Math.random() * 1440 - 720)}deg`)
			bean.addEventListener('animationend', () => bean.remove())
			document.body.appendChild(bean)
		}
	}

	_barrelRoll () {
		this.input.blur()
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return this.error('Imagine a barrel roll.')

		document.body.classList.add('barrel-roll')
		setTimeout(() => document.body.classList.remove('barrel-roll'), 1000)
	}

	events () {
		let strings = this.state.strings
		let l = this.input

		l.addEventListener('blur', () => {
			this.setState({
				inputValue: '',
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
					case 0: // amount of time worked
						const ival = this.state.inputValue
						if (ival === 'setup') {
							this._setup()
							return
						}
						if (ival === 'query' || ival === 'q') {
							this._query()
							return
						}
						const said = ival.trim().toLowerCase()
						if (said === 'beans') return this._beans()
						if (said === 'do a barrel roll') return this._barrelRoll()
						if (said.startsWith('sudo')) {
							return this.error('You are not in the sudoers file. This incident will be reported.')
						}
						if (filterFloat(ival) === 0) return this.error(`0 hours? That's not a bean, that's a nap.`)
						if (filterFloat(ival) >= 24) {
							return this.error(`${escapeHTML(ival)} hours? There are only 24 in a day. Even for you.`)
						}
						this.setState({
							placeholder: strings.s0.placeholder,
							commit: { ...this.state.commit, hours: ival}
						})
						if (!isNaN(filterFloat(ival))) {
							if (ival === '1') {
								this.setState({
									summary: `${strings.s0.singularHour} `
								})
							} else {
								this.setState({
									summary: `${ival} ${strings.s0.pluralHour} `
								})
							}
						} else return this.error(`"${escapeHTML(ival)}" isn't a number of hours. That's OK. Numbers are hard.`)
						break;
					case 1: // time of day
						const s1s = strings.s1 // alias stage 1 strings
						let humanTOD = '' // TOD == time of day
						let ts = new Date().toTimeString().split(' ')[0]

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
									humanTOD = `@ ${ts} (${TODfromTimestamp(ts, this.state.commit.hours, s1s)})`
								} else {
									this.error('Jars no longer supports custom TOD strings')
									return
								}
						}

						this.setState({
							placeholder: s1s.placeholder, // 'project'
							summary: this.state.summary + `${humanTOD} ${s1s.transition} `,
							commit: {
								...this.state.commit,
								tod: this.state.inputValue || TODfromTimestamp(ts, this.state.commit.hours, s1s) }
						})
						break;
					case 2: // project value
						if (this.state.inputValue == '') { this.error('No Project?'); return }
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

					if (this.state.customDate) {
						this.state.commit.date = YYYYMMDD(this.state.customDate)
					} else {
						this.state.commit.date = YYYYMMDD()
					}

					if (!this.assure()) {
						// commit is malformed
						this.error('Bean malformed!')
						return
					}

					const receipt = this._receipt(this.state.commit.hours)

					// commit!
					window.storage.set(this.state.commit).then(() => {
						let e = new CustomEvent('commit', { detail: this.state.commit })
						document.dispatchEvent(e)
					}).catch(() => alert('Failed to commit bean'))

					// reset
					this.setState({
						placeholder: strings.success + receipt,
						summary: '',
						commit: {}
					})

					// blurs() the input, returning focus to the main window
					setTimeout(() => {
						this.input.blur()
					}, receipt ? 4000 : 2000) // time to read about your mortality
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
