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
		if (!isValidAPIDate(date)) return false
		if (isNaN(filterFloat(hours))) return false
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
		console.warn(message, this.state.commit)
		setTimeout(() => {
			this.input.blur()
			this.input.classList.remove('error')
		}, 1000)
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
						} else this.error('Commit time not a valid number')
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
									humanTOD = `@ ${this.state.inputValue}`
								}
						}

						this.setState({
							placeholder: s1s.placeholder, // 'project'
							summary: this.state.summary + `${humanTOD} ${s1s.transition} `,
							commit: { ...this.state.commit, tod: this.state.inputValue }
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
