<template>
	<article class="task">
		<img src="~@/assets/img/jars-home-plus-icon.svg" alt="plus icon"><h2>{{event.event_title}}</h2>
		<p class="details">{{details}}</p>
	</article>
</template>

<script>

export default {
	name: 'event',
	computed: {
		details () {
			let detailsString = ''

			// if (this.task.subtasks !== '') {
			// 	let data = JSON.parse(this.task.subtasks)
			// 	let subtaskString = 'Sub-Task: ' + data[0][0]

			// 	// test for more than one subtask
			// 	if (data.length > 1) { // -- works
			// 		let tasklistString = ''

			// 		for (var i = 0; i < data.length; i++) {
			// 			let tmps = data[i][0] + ', '
			// 			tasklistString += tmps
			// 			if (i === data.length - 1) {
			// 				tasklistString = tasklistString.slice(0, -2)
			// 			}
			// 		}

			// 		detailsString = 'Sub-Tasks (' + data.length + '): ' + tasklistString
			// 	} else { detailsString = subtaskString }

			// // show in this order: time, reccurance, last completed (if no time set)
			// } else if (this.task.repeatPattern !== '') {
			// 	let data = JSON.parse(this.task.repeatPattern)

			// 	if (data.time !== '') {
			// 		detailsString = '@ ' + data.time + ', reccuring'
			// 	} else {
			// 		detailsString = data.text
			// 	}
			// }

			return detailsString
		}
	},
	props: ['event'],
	created () {

	}
}
</script>
