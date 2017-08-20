<template>
	<article class="task" :class="{editable: editable, dismissed: dismissed}">
		<img src="~@/assets/img/jars-home-plus-icon.svg" alt="plus icon" @click="expand">
		<h2 contenteditable="{true: editable}" @input="update">{{event.event_title}}</h2>
		<p class="details">{{details}}</p>
		<div class="editbox">
			<div class="row">
				<label for="time">Time</label>
				<input type="time" @input="update" v-model="event.event_time" name="time" placeholder="event.event_time" size="8">
			</div>
			<div class="row">
				<label for="date">Date</label>
				<input type="date" @input="update" v-model="event.event_date" name="date" placeholder="event.event_date" size="8">
			</div>
			<div class="row actions">
				<button @click="dismiss">Mark Completed</button>
				<button @click="remove">Delete</button>
			</div>
		</div>
	</article>
</template>

<script>
import axios from 'axios'

export default {
	name: 'event',
	data: () => ({
		editable: false,
		dismissed: false
	}),
	computed: {
		details () {
			let detailsString = ''

			detailsString = '@ ' + this.event.event_time

			return detailsString
		}
	},
	props: ['event'],
	methods: {
		expand: function () {
			this.editable = !this.editable
			if (this.editable) {

			}
		},
		update: function (event) {
			let e = event.target.localName
			var params = {}

			if (e === 'h2') {
				params.event_title = event.target.innerText
			}
			if (e === 'input') {
				// do the thing
				if (event.target.name === 'time') {
					params.event_time = event.target.value
				}
			}
			// Here's an idea: remove axios dependecy again and pass this to todaypage

			// send appropriate data
			axios.put('events/' + this.event.event_ID, JSON.stringify(params))
			.then(response => console.log(response))
		},
		dismiss: function () {
			this.dismissed = true
			setTimeout(axios.put('events/' + this.event.event_ID, {
				isDismissed: 1
			}), 2000)
		},
		remove: function () {
			this.dismissed = true
			setTimeout(axios.delete('events/' + this.event.event_ID), 2000)
		}
	}
}
</script>
