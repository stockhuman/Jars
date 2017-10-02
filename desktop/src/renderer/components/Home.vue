<template>
	<div class="wrapper">
		<h3 class="week-of-the-year">{{weekInfo}}</h3>

		<main>
			<section class="events">
				<table class="weekday-select">
					<tr class="weekday-row" @click="$emit('select', 1)">
						<td><h4 class="weekday">Monday</h4></td>
						<td class="weekday-num">({{days.mon.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 2)">
						<td><h4 class="weekday">Tuesday</h4></td>
						<td class="weekday-num">({{days.tue.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 3)">
						<td><h4 class="weekday">Wednesday</h4></td>
						<td class="weekday-num">({{days.wed.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 4)">
						<td><h4 class="weekday">Thursday</h4></td>
						<td class="weekday-num">({{days.thu.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 5)">
						<td><h4 class="weekday">Friday</h4></td>
						<td class="weekday-num">({{days.fri.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 6)">
						<td><h4 class="weekday">Saturday</h4></td>
						<td class="weekday-num">({{days.sat.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 7)">
						<td><h4 class="weekday">Sunday</h4></td>
						<td class="weekday-num">({{days.sun.length}})</td>
					</tr>
				</table>
				<!-- <task v-for="(task, index) in sunday" :task="task" :index="index" :key="task.task"></task> -->
				<!-- TODO: make this a proper module with computed props -->
				<div v-if="events.length > 0" class="event-results">
					<div v-for="event in events" class="event">
						<h2>{{event[3]}}</h2>
						<div class="event-details">
							<span v-if="event[4] != ''">{{event[4]}} </span>
							<span v-if="event[2] != ''">@ {{formatTime(event[2])}}</span>
						</div>
					</div>
				</div>
			</section>
			<logform></logform>
		</main>
	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import logform from './parts/Logform'

export default {
	name: 'today-page',
	components: { logform },
	computed: {
		weekInfo () {
			return 'Week of the ' +
				moment().startOf('isoWeek').format('Do') +
				' to ' +
				moment().endOf('isoWeek').format('Do')
		}
	},
	data: () => ({
		week: {},
		days: {
			mon: {},
			tue: {},
			wed: {},
			thu: {},
			fri: {},
			sat: {},
			sun: {},
			selected: null
		},
		events: []
	}),
	created () {
		let wk = '?filter=date,eq,' + moment().year() + moment().isoWeek() // eg: 201739

		// populate data
		axios.get('weeks/' + wk).then(r => { this.week = r.data })
		axios.get('mon/' + wk).then(r => { this.days.mon = r.data.mon.records })
		axios.get('tue/' + wk).then(r => { this.days.tue = r.data.tue.records })
		axios.get('wed/' + wk).then(r => { this.days.wed = r.data.wed.records })
		axios.get('thu/' + wk).then(r => { this.days.thu = r.data.thu.records })
		axios.get('fri/' + wk).then(r => { this.days.fri = r.data.fri.records })
		axios.get('sat/' + wk).then(r => { this.days.sat = r.data.sat.records })
		axios.get('sun/' + wk).then(r => { this.days.sun = r.data.sun.records })

		// display relevant data
		this.$on('select', day => {
			console.log('selected: ' + day)
			let elems = document.querySelectorAll('.weekday-row.selected');
			[].forEach.call(elems, function (el) {
				el.classList.remove('selected')
			})
			document.querySelectorAll('.weekday-row')[day - 1].classList.add('selected')
			this.selected = day

			// get the events of the requested day
			if (day === 1) { this.events = this.days.mon }
			if (day === 2) { this.events = this.days.tue }
			if (day === 3) { this.events = this.days.wed }
			if (day === 4) { this.events = this.days.thu }
			if (day === 5) { this.events = this.days.fri }
			if (day === 6) { this.events = this.days.sat }
			if (day === 7) { this.events = this.days.sun }
		})

		// Dismiss a task
		this.$on('dismiss', taskID => {
			// console.info('Dismissed task #' + taskID)

			setTimeout(function () {
				axios.put('weeks/' + taskID, { 'isDismissed': true })
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
	},
	methods: {
		formatTime: function (time) {
			// total fekkin hack, hardcoded localization. New schema?
			return moment('1997-05-24T' + time + ':00-04:00').format('h:m A')
		}
	}
}
</script>

<style lang="scss">
	@import '../assets/scss/variables';

	.events {
		padding-top: $pu;
		padding-bottom: 4 * $pu;
		display: flex;
		flex-wrap: row;
	}

	.weekday-row {
		cursor: pointer;
		&.selected {
			td:nth-child(2) {
				display: none;
			}
		}
	}

	.weekday {
		font-size: 15px;
		color: $color__blue;
		letter-spacing: 0.5px;
	}

	.weekday-select {
		tr {
			height: $pu / 1.1;
			font-family: "Hack", monospace;
			font-weight: bold;
			color: $color__grey;
		}
		.weekday-num {
			padding-left: 1em;
		}
	}

	.event-results {
		padding-left: 2.5 * $pu;
		.event {
			margin-bottom: $pu / 2;
			h2 {
				font-size: 20px;
				color: black;
			}
			.event-details {
				font-family: "Helvetica Light";
				font-style: oblique;
				color: $color__grey;
				font-size: 12px;
			}
		}
	}
</style>
