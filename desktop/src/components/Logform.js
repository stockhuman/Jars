import React, { Component } from 'react'

import { filterFloat } from '../utilities/filters'
import locales from '../locales/locales'

import '../styles/Logform.scss'

// Temp: localStorage only
export default class Logform extends Component {

	constructor(props) {
		super(props)
		this.state = {
			strings: locales('logform'),
			hours: 0,
			inputValue: '',
			stage: 0,
			summary: '',
			placeholder: '',
			commit: {}
		}
		this.state.placeholder = this.state.strings.misc.placeholder
	}

	appendTime = hours => {
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

	updateInputValue = event => {
		if (event.target) {
			this.setState({ inputValue: event.target.value })
		}
	}

	render() {
		let strings = this.state.strings

		const begin = () => {
			this.setState({ placeholder: strings.misc.begin })
		}

		const abort = () => {
			this.setState({ stage: 0 })
			this.updateInputValue('')
			this.setState({
				placeholder: strings.misc.placeholder,
				summary: '',
				stage: 0
			})
		}

		const nextField = event => {
			const strings = this.state.strings

			if (event.key === 'Enter') {
				switch (this.state.stage) {
					case 0:
						this.setState({ placeholder: strings.s0.placeholder })
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
						}
						break;
					case 1:
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
							default: // if something else is input,
								if (this.state.inputValue === '') {
									// returns 'HH:MM:SS'
									humanTOD = `@ ${new Date().toTimeString().split(' ')[0]}`
								} else {
									// or to what was input
									humanTOD = `<b>${this.state.inputValue}</b>`
								}
						}

						this.setState({
							placeholder: s1s.placeholder, // 'project'
							summary: this.state.summary + `${humanTOD} ${s1s.transition} `
						})
						break;
					case 2:
						this.setState({
							placeholder: strings.s2.placeholder,
							summary: `${this.state.summary + this.state.inputValue} => `
						})
						break;
					case 3:
						this.setState({
							placeholder: strings.s3.placeholder,
							summary: `${this.state.summary + this.state.inputValue}. (${strings.s3.category}: `
						})
						break;
					case 4:
						this.setState({
							placeholder: strings.s4.placeholder,
							summary: this.state.summary + this.state.inputValue + ') '
					 })
						break;
					case 5:
						this.setState({
							placeholder: strings.s5.placeholder,
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

				if (this.state.stage <= 5) {
					this.setState({
						inputValue: '',
						stage: this.state.stage + 1
					})
					console.log('now on stage ' + this.state.stage)
				} else {
					this.setState({
						placeholder: strings.success,
						summary: ''
					})

					// commit!
					// this.commit.date = dayjs().format('YYYY-MM-DD')
					// axios.post('beans/', this.commit).then(() => {
					// 	this.computeHours()
					// })

					// blurs() the input, returning focus to the main window
					setTimeout(function (e) {
						e.blur()
						abort()
					}, 2000, event.nativeEvent.target)
				}
			}
		}

		return (
			<section className="log">
				<div className="live-update" dangerouslySetInnerHTML={{ __html: this.state.summary }}></div>
				<input
					type="text"
					className="log-input"
					id="log"
					autoComplete="off"
					value={ this.state.inputValue }
					onChange={ evt => this.updateInputValue(evt) }
					placeholder={ this.state.placeholder }
					onFocus={ begin }
					onBlur={ abort }
					onKeyUp={ nextField } />
				<span className="commits-this-week">{strings.misc.recap} {this.state.hours}</span>
			</section>
		)
	}

}
