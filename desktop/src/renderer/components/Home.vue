<template>
	<div class="wrapper">
		<h3 class="week-of-the-year">{{weekInfo}}</h3>

		<main>
			<section class="events">
				<table class="weekday-select no-select">
					<!-- this can be done in a for loop with data array -->
					<tr class="weekday-row" @click="$emit('select', 1)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(0)">Monday</h4></td>
						<td class="weekday-num">({{days.mon.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 2)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(1)">Tuesday</h4></td>
						<td class="weekday-num">({{days.tue.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 3)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(2)">Wednesday</h4></td>
						<td class="weekday-num">({{days.wed.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 4)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(3)">Thursday</h4></td>
						<td class="weekday-num">({{days.thu.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 5)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(4)">Friday</h4></td>
						<td class="weekday-num">({{days.fri.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 6)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(5)">Saturday</h4></td>
						<td class="weekday-num">({{days.sat.length}})</td>
					</tr>
					<tr class="weekday-row" @click="$emit('select', 7)">
						<td><h4 class="weekday" v-on:dblclick="newEvent(6)">Sunday</h4></td>
						<td class="weekday-num">({{days.sun.length}})</td>
					</tr>
				</table>
				<!-- <task v-for="(task, index) in sunday" :task="task" :index="index" :key="task.task"></task> -->
				<!-- TODO: make this a proper module with computed props -->
				<div v-if="events.length > 0" class="event-results">
					<div v-for="event in events" class="event" @click="viewEvent(event)">
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

		<eventpanel :event="selectedEvent" :hidden="panelHidden"></eventpanel>
	</div>
</template>

<script>
/**
 * GENERAL TODO: seprate once functionality is finalized into separate components for readability
 *
 *
 */
import axios from 'axios'
import moment from 'moment'
import logform from './parts/Logform'
import eventpanel from './parts/EventPanel'

export default {
	name: 'today-page',
	components: { logform, eventpanel },
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
		events: [],
		selectedEvent: {
			create: false,
			date: '',
			title: '',
			time: '',
			loc: ''
		},
		panelHidden: true
	}),
	created () {
		this.fetchData()

		// display relevant data
		this.$on('select', day => {
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

		// Dismiss the event panel
		this.$on('dismiss-panel', () => {
			this.panelHidden = true
		})

		// Create Event
		this.$on('create-event', event => {
			console.log(event)
			let weekcode = '' + moment().year() + moment().isoWeek() // '201740'
			let day = moment(event.date + ' ' + moment().year(), 'MMM Do YYYY').format('ddd') // 'Wed'
			day = day.toLowerCase()
			console.log(day)

			// TODO: event creation w/ axios
			let newE = {
				date: weekcode,
				time: event.time,
				title: event.title,
				location: event.loc
			}

			axios.post(day + '/', newE).then(r => {
				console.log(r)
			})
			this.panelHidden = true
		})
	},
	methods: {
		formatTime: function (time) {
			// total fekkin hack, hardcoded localization. New schema?
			return moment('1997-05-24T' + time + ':00-04:00').format('h:m A')
		},
		newEvent: function (day) {
			this.selectedEvent.isNewEvent = true
			this.selectedEvent.date = moment().startOf('isoWeek').add(day, 'days').format('MMM Do')
			this.panelHidden = false
		},
		viewEvent: function (event) {
			this.selectedEvent = event
			this.selectedEvent.isNewEvent = false
			this.panelHidden = false
		},
		fetchData: function () {
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
