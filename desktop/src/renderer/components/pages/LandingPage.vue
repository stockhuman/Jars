<template>
	<div class="wrapper">
		<!-- Jars logo ? animated jars couter -->
		<!-- <img id="logo" src="~@/assets/img/logo.png" alt="electron-vue"> -->
		<main class="welcome">
			<h1>{{welcome}}</h1>
			<hr/>
			<!-- stats, calendar and things to do -->
		</main>
	</div>
</template>

<script>
// turn this page into a loader thing. timeout, route to today / login.

import axios from 'axios'
import moment from 'moment'

export default {
	name: 'landing-page',
	data: () => ({
		account: []
	}),
	created () {
		axios.get('http://localhost/api.jars.com/users/')
		.then(response => {
			this.account = response.data[0]
		})
		.catch(response => {
			this.account = {
				user_nicename: ' '
			}
		})
	},
	computed: {
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
			return this.greeting + ', ' + this.name + '!'
		}
	}
}
</script>

<style>

	#logo {
		height: auto;
		margin-bottom: 20px;
		width: 420px;
	}

	.welcome h1 {
		color: #EAE0D5;
		font-size: 30px;
		margin-bottom: 10px;
		/*color: #fff;*/
		/*text-align: center;*/
		width: 100%;
	}

</style>
