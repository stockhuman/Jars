<template>
	<article class="task" :class="{editable: editable, dismissed: dismissed}">
		<img src="~@/assets/img/jars-home-plus-icon.svg" alt="plus icon" @click="expand">
		<h2 contenteditable="{true: editable}" @input="update">{{task.title}}</h2>
		<p class="details">{{details}}</p>
		<div class="editbox">
			<div class="row">
				<label for="time">Time</label>
				<input type="time" @input="update" v-model="task.time" name="time" placeholder="task.time" size="8"></div>
			<div class="row">
				<label for="repeat">Sub-Tasks</label>
				<input type="text" name="repeat" v-model="task.subtasks" placeholder="Again?"></div>
			<div class="row actions">
				<button @click="expand">Done Editing</button>
				<button @click="dismiss" class="alt">Mark Completed</button>
				<button @click="subtask">Add Subtask</button>
			</div>
		</div>
		<!-- <p style="color: lightgreen">{{task}}</p> -->
	</article>
</template>

<script>
import axios from 'axios'

export default {
	name: 'task',
	data: () => ({
		editable: false,
		dismissed: false
	}),
	computed: {
		details () {
			let detailsString = ''
			let subtasks = JSON.parse(this.task.subtasks)
			// let repeat = JSON.parse(this.task.repeatPattern)

			// priority to the subtask message
			if (subtasks.length !== 0) {
				let subtaskString = 'Sub-Task: ' + subtasks

				// test for more than one subtask
				if (subtasks.length > 1) { // -- works
					let tasklistString = ''

					for (var i = 0; i < subtasks.length; i++) {
						let tmps = subtasks[i][0] + ', '
						tasklistString += tmps
						if (i === subtasks.length - 1) {
							tasklistString = tasklistString.slice(0, -2)
						}
					}

					detailsString = 'Sub-Tasks (' + subtasks.length + '): ' + tasklistString
				} else { detailsString = subtaskString }

			// show in this order: time, reccurance, last completed (if no time set)
			// } else if (repeat.length !== 0) {
			// 	if (repeat.time !== '') {
			// 		detailsString = '@ ' + this.task.time + ', reccuring' // changed from repeat.time
			// 	} else {
			// 		detailsString = repeat.text
			// 	}
			// } else {
				detailsString = '@ ' + this.task.time
			}

			return detailsString
		}
	},
	props: ['task'],
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
				params.title = event.target.innerText
			}
			if (e === 'input') {
				// do the thing
				let repeat = JSON.parse(this.task.repeatPattern)
				if (event.target.name === 'time') {
					if (repeat.length !== 0) {
						repeat.time = event.target.value
						params.repeatPattern = JSON.stringify(repeat)
					} else {
						params.time = event.target.value
					}
				}
			}
			// Here's an idea: remove axios dependecy again and pass this to todaypage

			// send appropriate data
			axios.put('tasks/' + this.task.task, JSON.stringify(params))
			.then(response => console.log(response))
		},
		repeatingTaskCheck: function () {
			if (this.edibox) { // fails if there is no editbox, ie: no repeat
				// do nothing
			}
		},
		dismiss: function () {
			this.dismissed = true
			// this.repeatingTaskCheck()
			setTimeout(axios.put('tasks/' + this.task.task, {
				isDismissed: true
			}), 2000)
		},
		subtask: function () {

		}
	}
}
</script>
