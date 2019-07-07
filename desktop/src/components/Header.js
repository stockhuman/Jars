import React, { Component } from 'react'

import locales from '../locales/locales'

import '../styles/Header.scss'


export default class Header extends Component {

	constructor(props) {
		super(props)

		this.state = {
			name: 'Michael', // temporary hardcoded name
			strings: locales('header'),
			computedFraction: '',
			computedGreeting: '' ,
		}

		this.greeting = this.greeting.bind(this)
	}

	componentDidMount() {
		this.setState({ strings: locales('header') })
		this.setState({ computedFraction: this.fraction() })
		this.setState({ computedGreeting: this.greeting() })
	}

	greeting() {
		let hr = new Date().getHours()
		let msg = ''

		// eslint-disable-next-line default-case
		switch (hr) {
			case 3:
			case 4: msg = this.state.strings.greetings[0]
				break
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10: msg = this.state.strings.greetings[1]
				break
			case 11:
			case 12: msg = this.state.strings.greetings[2]
				break
			case 13:
			case 14:
			case 15:
			case 16: msg = this.state.strings.greetings[3]
				break
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22: msg = this.state.strings.greetings[4]
				break
			case 23:
			case 0:
			case 1:
			case 2: msg = this.state.strings.greetings[5]
				break
		}
		return msg
	}

	fraction() {
		const formatTime = time => Math.ceil(time / (1000 * 3600 * 24))

		// TODO: add this to profile as data
		// compute how long I have to live
		let birth = new Date('4/24/1997')
		let death = new Date('4/24/2077')

		let DDC = formatTime(death) - formatTime(birth) // formatted to 29000
		let life = formatTime(new Date(Date.now()).getTime()) - formatTime(birth)

		return life + ' / ' + DDC
	}

	render() {
		return (
			<header id="header">
				<div id="header-inner">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
						<circle fill="#FFFFFF" cx="64" cy="64" r="64" />
						<g>
							<defs>
								<rect id="mask"
									// eslint-disable-next-line
									width={eval(this.state.computedFraction || 0) * 100}
									height="128"/>
							</defs>
							<clipPath id="clip"><use xlinkHref="#mask"/></clipPath>
							<circle cx="64" cy="64" r="64" fill="#00AEEF" clipPath="url(#clip)" />
						</g>
					</svg>
					<div className="welcome-block">
						<h1>{ this.state.name !== ''
						? `${this.state.computedGreeting}, ${this.state.name}`
						: this.state.computedGreeting }
						</h1>
						<h2 className="fraction">
							{ this.state.computedFraction } - {this.state.strings.fraction}
						</h2>
					</div>
				</div>
				{/* <navigation></navigation> */}
			</header>
		)
	}
}
