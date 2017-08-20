<template>
	<div class="wrapper">
		<header id="header">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.13 136.1">

				<title>Circle of life</title>

				<!-- Days spent -->
				<path d="M0,68a69,69,0,0,0,34.53,59.81V8.24A69,69,0,0,0,0,68Z" style="fill:#00aeef"/>

				<!-- Days left -->
				<path d="M33.54,9.79l.52-.32V127a68.05,68.05,0,1,0,34-127A67.54,67.54,0,0,0,33.53,9.47C33.53,9.57,33.54,9.68,33.54,9.79Z" style="fill:#fff"/>

			</svg>
			<h2>{{fraction}}</h2>
			<!-- make computed -->
			<h3>{{tasks.length}} tasks, {{events.length}} events today</h3>
			<h1>{{welcome}}</h1>
			<hr />
		</header>

		<main>
			<section id="day-tasks" v-if="tasks.length > 0">
				<h3 class="section-title">tasks</h3>
				<task v-for="(task, index) in tasks" :task="task" :index="index" :key="task.task"></task>
			</section>
			<section id="day-events" v-if="events.length > 0">
				<h3 class="section-title">events</h3>
				<event v-for="(event, index) in events" :event="event" :index="index" :key="event.event_ID"></event>
			</section>
		</main>

		<div id="fab-button" class="fab" :class="{active: fabActive}" @click="fabActive = !fabActive"></div>
	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Task from '../Task'
import Event from '../Event'

export default {
	name: 'today-page',
	components: { Task, Event },
	computed: {
		date () {
			return moment().format('LLL')
		},
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
	data: () => ({
		account: [],
		tasks: [],
		events: [],
		fabActive: false
	}),
	created () {
		axios.get('users/0')
		.then(response => {
			this.account = response.data
		})
		.catch(response => {
			this.account = {
				user_nicename: ' '
			}
		})

		// axios.get('tasks?transform=1&filter=isDismissed,eq,0')
		axios.get('tasks?transform=1')
		.then(response => {
			this.tasks = response.data.tasks
		})
		.catch(e => {})

		axios.get('events?transform=1')
		.then(response => {
			this.events = response.data.events
		})
		.catch(e => {})
	}
}
</script>

<style scoped lang="scss">
	@import '../../assets/scss/variables';

	#header {
		width: 100%;
		text-align: center;
		color: #eee;
		svg {
			width: 10em;
			padding: 2em;
		}
		h3, { // tasks, events summary
			margin: 7px;
			letter-spacing: 1px;
		}
		h1 {
			margin-top: 1.2em;
			margin-bottom: .5em;
		}
	}

	#day-tasks, #day-events {
		color: #eee;
		width: 100%;
		padding-bottom: .7em;
	}

	.section-title {
		font-size: 22px;
	}

	.fab {
		position: absolute;
		bottom: 5em;
		right: 2em;
		width: 3em;
		height: 3em;
		background: #00aeef;
		cursor: pointer;
		border-radius: 50%;
		transition: width .3s ease .2s, border-radius .1s ease;
		&:hover {
			background: lighten(#00aeef, 10%);
		}
	}

	.fab.active {
		width: calc(100% - 4em);
		border-radius: 3px;
		transition: width .3s ease 0s, border-radius .1s ease .4s;
	}
</style>
