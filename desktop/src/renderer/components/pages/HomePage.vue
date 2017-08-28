<template>
	<div class="wrapper">
		<header id="header">
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
		</header>
		<main>
			<section v-if="tasks.length > 0">
				<h4 class="weekday" @click="$emit('add', 1)">Monday</h4>
				<task v-for="(task, index) in monday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 2)">Tuesday</h4>
				<task v-for="(task, index) in tuesday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 3)">Wednesday</h4>
				<task v-for="(task, index) in wednesday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 4)">Thursday</h4>
				<task v-for="(task, index) in thursday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 5)">Friday</h4>
				<task v-for="(task, index) in friday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 6)">Saturday</h4>
				<task v-for="(task, index) in saturday" :task="task" :index="index" :key="task.task"></task>
				<h4 class="weekday" @click="$emit('add', 7)">Sunday</h4>
				<task v-for="(task, index) in sunday" :task="task" :index="index" :key="task.task"></task>
			</section>
		</main>

	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Task from '../Task'
import Event from '../Event'
// import Fab from '../Navigation/Fab'

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
		},
		monday () { return this.sortByDay('Monday') },
		tuesday () { return this.sortByDay('Tuesday') },
		wednesday () { return this.sortByDay('Wednesday') },
		thursday () { return this.sortByDay('Thursday') },
		friday () { return this.sortByDay('Friday') },
		saturday () { return this.sortByDay('Saturday') },
		sunday () { return this.sortByDay('Sunday') }
	},
	data: () => ({
		account: [],
		tasks: [],
		events: []
	}),
	created () {
		// get my name (as inneficiently as possible: this should be in localstorage)
		axios.get('users/0').then(response => {
			this.account = response.data
		}).catch(e => { this.account = { user_nicename: ' ' } })

		// Update a task
		this.$on('edit', action => {
			if (action[1].time !== '') {
				action[1].time = moment(action[1].time, 'LT').format('HH:mm:ss')
			}
			axios.put('tasks/' + action[0], JSON.stringify(action[1]))
			.then(response => console.log(response))
		})

		// Add a task
		this.$on('add', day => {
			let date = moment()
			if (date.format('d') !== day) { // selected a day in the future
				let dm = moment().startOf('isoWeek') // monday's date
				console.log(dm.format('d'))
				let dt = date.format('d') // today as int

				if (dt < day) { // day selected is in the future
					date = dm.add(day - 1, 'd')
				} else { // day selected has already passed this week
					date = dm.add(day + 6, 'd')
				}
			}

			date.format('YYYY-MM-DD')

			axios.post('tasks', {
				'title': 'title',
				'time': '12:00:00',
				'date': date }).then(this.getTasks())
		})

		// Dismiss a task
		this.$on('dismiss', taskID => {
			// console.info('Dismissed task #' + taskID)

			setTimeout(function () {
				axios.put('tasks/' + taskID, { 'isDismissed': true })
			}, 1000)

			setTimeout(() => {
				for (var i = 0; i < this.tasks.length; i++) {
					if (this.tasks[i].task === taskID) {
						this.tasks.splice(i, 1)
						break
					}
				}
			}, 1500)
		})

		this.getTasks()
	},
	methods: {
		getTasks: function () {
			// get the tasks!
			axios.get('tasks?transform=1&filter=isDismissed,eq,0')
			.then(response => {
				this.tasks = response.data.tasks

				// sanitize data
				for (var i = 0; i < this.tasks.length; i++) {
					let t = this.tasks[i]
					t.tags = t.tags.split(',')
					t.time = moment(t.time, ['HH:mm:ss']).format('LT')
					// t.date = moment(t.date, ['yyyy-MM-dd']).format('yyyy-MM-dd')
				}
			})
			.catch(e => {})
		},
		sortByDay: function (day) {
			let result = []

			for (var i = 0; i < this.tasks.length; i++) {
				if (moment(this.tasks[i].date).format('dddd') === day) {
					result.push(this.tasks[i])
				}
			}

			return result
		}
	}
}
</script>

<style scoped lang="scss">
	@import '../../assets/scss/variables';

	#header {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		color: $color__light;
		margin-bottom: 2em;

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
			font-size: 10px;
			color: $color__grey;
		}
	}

	.weekday {
		font-size: 13px;
		color: $color__blue;
		font-style: italic;
		cursor: pointer;
		&:not(:first-child) {
			padding-top: 1em;
		}
	}
</style>
