<template>
	<section class="events">
		<table class="weekday-select no-select">
			<tr v-for="(weekday, index) in weekdays" 
					v-on:click="selectDay(index)" 
					class="weekday-row">
				<td><h4 class="weekday" v-on:dblclick="newEvent(index)">{{weekday.title}}</h4></td>
				<td class="weekday-num">{{weekday.events.length}}</td>
			</tr>
		</table>

		<div v-if="events.length > 0" class="event-results">
			<event v-for="event in events" :event="event" :key="event[0]"></event>
		</div>

		<eventpanel :event="panelData" :hidden="panelHidden"></eventpanel>
	</section>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import eventpanel from './EventPanel'
import event from './Event'

export default {
	name: 'events',
	components: { eventpanel, event },
	data: () => ({
		weekdays: [
			{day: 'Mon', events: [], title: 'Monday'},
			{day: 'Tue', events: [], title: 'Tuesday'},
			{day: 'Wed', events: [], title: 'Wednesday'},
			{day: 'Thu', events: [], title: 'Thursday'},
			{day: 'Fri', events: [], title: 'Friday'},
			{day: 'Sat', events: [], title: 'Saturday'},
			{day: 'Sun', events: [], title: 'Sunday'}
		],
		events: [],
		panelData: {
			isNew: false,
			date: '',
			title: '',
			time: '',
			location: ''
		},
		panelHidden: true
	}),
	props: ['wkc'], // week code for week switching
	watch: {
		// watch for weekcode changes
		wkc: function () {
			for (let e = 0; e < this.weekdays.length; e++) {
				this.weekdays[e].events = []
				this.events = []
			}
			this.fetchData()
		}
	},
	created () {
		this.fetchData()

		// Dismiss the event panel
		this.$on('dismiss-panel', () => {
			this.panelHidden = true
		})

		// create a new event
		this.$on('create-event', event => {
			let datetime = ''

			if (event.time === '') {
				datetime = moment(
					event.nicedate + ' ' + moment().year(),
					'MMM Do YYYY').format('YYYY-MM-DD HH:mm:ss')
			} else {
				datetime = moment(
					event.nicedate + ' ' + moment().year() + ' ' + event.time,
					'MMM Do YYYY h:mmA').format('YYYY-MM-DD HH:mm:ss')
			}

			let evt = {
				week: this.wkc,
				datetime: datetime,
				time: moment(datetime).format('h:mmA'), // this param is ignored by the server
				nicedate: moment(datetime).format('MMM Do'), // this one too
				title: event.title,
				location: event.location
			}

			axios.post('events/', evt).then(r => { console.log(r) })

			this.panelHidden = true

			for (let e = 0; e < this.weekdays.length; e++) {
				if (moment(datetime).format('ddd') === this.weekdays[e].day) {
					this.weekdays[e].events.push(evt)
				}
			}
		})

		this.$on('view-event', event => {
			this.panelData = event
			this.panelData.isNew = false
			this.panelHidden = false
		})

		this.$on('update-event', event => {
			let datetime = ''
			if (event.time === '') {
				datetime = moment(
					event.nicedate + ' ' + moment().year(),
					'MMM Do YYYY').format('YYYY-MM-DD HH:mm:ss')
			} else {
				datetime = moment(
					event.nicedate + ' ' + moment().year() + ' ' + event.time,
					'MMM Do YYYY h:mmA').format('YYYY-MM-DD HH:mm:ss')
			}
			axios.put('events/' + event.ID, {
				title: event.title,
				location: event.location,
				datetime: datetime
			})
		})

		this.$on('delete-event', event => {
			this.removeEvent(event)
		})

		this.$on('commit-event', event => {
			let tod = ''
			switch (moment(event.time, 'h:mmA').hour()) {
			case 3:
			case 4: tod = 'em'
				break
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10: tod = 'm'
				break
			case 11:
			case 12: tod = 'md'
				break
			case 13:
			case 14:
			case 15:
			case 16: tod = 'an'
				break
			case 17:
			case 18:
			case 19:
			case 20: tod = 'ev'
				break
			case 21:
			case 22:
			case 23: tod = 'n'
				break
			case 0:
			case 1:
			case 2: tod = 'ln'
				break
			}

			let commit = {
				date: moment(event.nicedate + ' ' + moment().year(), 'MMM Do YYYY').format('YYYY-MM-DD'),
				time: event.commit,
				tod: tod,
				project: 'life',
				task: event.title,
				cat: 'Events',
				comment: event.location ? 'At ' + event.location : ''
			}

			// fixes reactivity in the commited this week in Logform
			axios.post('beans/', commit).then(() => {
				console.log('Committed: ' + commit.time + 'h in ' + commit.project)
				// this.$root.$emit('event-commit', commit.time)
			})

			this.removeEvent(event)
		})
	},
	methods: {
		fetchData: function () {
			let wk = '?filter=week,eq,' + this.wkc
			axios.get('events/' + wk).then(r => {
				for (let i = r.data.events.records.length - 1; i >= 0; i--) {
					let evt = r.data.events.records[i]

					for (let e = 0; e < this.weekdays.length; e++) {
						let t = moment(evt[2])
						if (t.format('ddd') === this.weekdays[e].day) {
							let obj = {
								ID: evt[0],
								title: evt[3],
								time: t.format('h:mmA'),
								nicedate: moment(evt[2]).format('MMM Do'),
								location: evt[4]
							}
							this.weekdays[e].events.push(obj)
						}
					}
				}
			})
		},
		// get the events of the requested day
		selectDay: function (day) {
			let elems = document.querySelectorAll('.weekday-row.selected');
			[].forEach.call(elems, function (el) {
				el.classList.remove('selected')
			})
			document.querySelectorAll('.weekday-row')[day].classList.add('selected')
			this.events = this.weekdays[day].events
			this.panelHidden = true
		},

		newEvent: function (day) {
			this.panelData.isNew = true
			this.panelData.nicedate =
				moment(this.wkc + 0, 'YYYYWWe').startOf('isoWeek').add(day, 'days').format('MMM Do')
			// this.panelData.week = '' + moment().year() + moment().isoWeek()
			this.panelData.title = ''
			this.panelData.time = ''
			this.panelData.location = ''
			this.panelHidden = false
		},

		resetPanel: function () {
			this.panelData.title = ''
			this.panelData.time = ''
			this.panelData.nicedate = ''
			this.panelData.location = ''
			this.panelHidden = true
		},

		removeEvent: function (event) {
			axios.delete('events/' + event.ID)
			for (let d = 0; d < this.weekdays.length; d++) {
				for (let e = 0; e < this.weekdays[d].events.length; e++) {
					if (this.weekdays[d].events[e].ID === event.ID) { // this is colossally stupid
						this.weekdays[d].events.splice(e, 1)
					}
				}
			}
			this.resetPanel()
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';

	.events {
		padding-top: $pu;
		padding-bottom: 4 * $pu;
		display: flex;
		flex-wrap: row;
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
	.weekday-row {
		cursor: pointer;
		&.selected h4 {
			color: black;
		}
	}

	.weekday {
		font-size: 15px;
		color: $color__blue;
		letter-spacing: 0.5px;
	}
</style>
