<template>
	<header id="header">
		<div id="header-inner">
			<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
				<!-- base -->
				<circle fill="#FFFFFF" cx="64" cy="64" r="64"/>
				<g>

					<defs><rect id="mask" :width="lifeClip" height="128"/></defs>
					<clipPath id="clip"><use xlink:href="#mask"/></clipPath>
					<circle class="st1" cx="64" cy="64" r="64" fill="#00AEEF" clip-path="url(#clip)"/>
				</g>
			</svg>
			<div class="welcome-block">
				<h1>{{welcome}}</h1>
				<h2 class="fraction">{{fraction}}</h2>
				<p>This time will pass today</p>
			</div>
		</div>
		<navigation></navigation>
	</header>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import navigation from './Navigation'

export default {
	name: 'top', // got I'm an idiot, I set it to 'header'
	components: { navigation },
	computed: {
		fraction () {
			function formatTime (time) {
				return Math.ceil(time / (1000 * 3600 * 24))
			}

			// compute how long I have to live
			let birth = new Date('4/24/1997')
			let death = new Date('4/24/2077')

			// var lifeTime = Math.abs(death.getTime() - birth.getTime())
			// var lifeDays = formatTime(lifeTime)

			let DDC = formatTime(death) - formatTime(birth) // formatted to 29000

			let life = formatTime(new Date(Date.now()).getTime()) - formatTime(birth)

			return life + ' / ' + DDC
		},
		lifeClip () {
			return eval(this.fraction) * 100 // eslint-disable-line
		},
		name () { // compute the first name only
			let nn = this.account.user_nicename || ''
			let spacePosition = nn.indexOf(' ')
			if (spacePosition === -1) return nn
			else return nn.substr(0, spacePosition)
		},
		greeting () {
			let hr = moment().hour()
			let msg = ''

			switch (hr) {
			case 3:
			case 4: msg = 'You’re up early'
				break
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10: msg = 'Good morning'
				break
			case 11:
			case 12: msg = 'Good day'
				break
			case 13:
			case 14:
			case 15:
			case 16: msg = 'Good afternoon'
				break
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22: msg = 'Good Evening'
				break
			case 23:
			case 0:
			case 1:
			case 2: msg = 'Good night'
				break
			}
			return msg
		},
		welcome () {
			return this.greeting + ', ' + this.name
		}
	},
	created () {
		// get my name (as inneficiently as possible: this should be in localstorage)
		axios.get('users/0').then(response => {
			this.account = response.data
		}).catch(e => { this.account = { user_nicename: ' ' } })
	},
	data: () => ({
		account: []
	})
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';
	.nav-links {
		position: absolute;
		right: $pu;
		bottom: 8px;
	}
	
	.nav-links li {
		display: inline-block;
		padding-left: ($pu / 4);
	}

	.nav-link {
		color: $color__grey;
		text-decoration: none;
		padding: 2px;
		&:hover {
			background: $color__grey;
			color: white;
		}
	}

	#header {
		width: 100%;
		position: relative;
		border: 1px solid white;
		font-family:  "Helvetica Neue Light", Helvetica, Arial, sans-serif;
	}
	#header-inner {
		width: 100%;
		margin: $pu;
		border-bottom: 1ps solid white;
		display: flex;
		flex-wrap: wrap;

		svg {
			width: 4em;
			height: 4em;
			margin-top: .5em;
			margin-right: 2em;
		}

		h1 {
			margin-top: .2em;
			margin-bottom: .2em;
			font-size: 25px;
		}

		.fraction {
			font-size: 13px;
			color: $color__grey;
		}

		.welcome-block p {
			font-size: 11px;
			color: $color__grey;
		}
	}
</style>
