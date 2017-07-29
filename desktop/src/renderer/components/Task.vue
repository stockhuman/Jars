<template>
	<article class="task" :class="{editable: editable}">
		<img src="~@/assets/img/jars-home-plus-icon.svg" alt="plus icon" @click="expand">
		<h2 contenteditable="{true: editable}" @input="update">{{task.title}}</h2>
		<p class="details">{{details}}</p>
		<div class="editbox">
			<div class="row">
				<label for="time">Time</label>
				<input type="text" v-model="task.time" name="time" placeholder="task.time"></div>
			<div class="row">
				<label for="repeat">Repeat</label>
				<input type="text" name="repeat" v-model="editbox.text" placeholder="task.repeatPattern.text"></div>
		</div>
		<!-- <p style="color: lightgreen">{{task}}</p> -->
	</article>
</template>

<script>
import axios from 'axios'

export default {
	name: 'task',
	data: () => ({
		editable: false
	}),
	computed: {
		details () {
			let detailsString = ''
			let subtasks = JSON.parse(this.task.subtasks)
			let repeat = JSON.parse(this.task.repeatPattern)

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
			} else if (repeat.length !== 0) {
				if (repeat.time !== '') {
					detailsString = '@ ' + repeat.time + ', reccuring'
				} else {
					detailsString = repeat.text
				}
			}

			return detailsString
		},
		editbox () {
			return JSON.parse(this.task.repeatPattern)
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
			axios.put('tasks/' + this.task.task, {
				title: event.target.innerText
			})
			.catch((error) => {
				console.warn(error)
			})
		}
	}
}
</script>

<style lang="scss">
@import '../assets/scss/variables';

.task { // article element
	// margin-bottom: 1em;
	position: relative;
	transition: background .3s ease;
	border-radius: 4px;
	padding-right: 1.2em;
	padding-left: 1.5em;
	padding-bottom: 1em;
	padding-top: .5em;
	h2 {
		font-size: 20px;
	}
	img {
		position: absolute;
		width: 20px;
		left: 0px;
		top: 10px;
		padding: 3px;
    transition: transform .25s ease;
		&:hover {
			transform: rotateZ(90deg);
			cursor: pointer;
		}
	}
	.details {
		font-size: 14px;
		color: #678;
		font-style: italic;
		padding-top: 2px;
		font-family: Helvetica, sans-serif;
		font-variant: oblique;
		transition: all .5s ease;
		max-height: 1em;
	}
	.editbox {
		max-height: 0;
		overflow: hidden;
		// display: flex;
		// flex-wrap: row;
		transition: all .6s ease;

		.row {
			// display: block;
			// width: 100%;
			// flex-grow: 1;
		}

		label, input {
			color: #9ab;
			font-size: 15px;
			width: 100%;
		}

		label {
			font-size: 12px;
		}

		input {
			background: transparent;
			border: none;
			padding: 1em;
			line-height: 1;
			outline: none;
			border-bottom: 1px solid transparent;
			transition: border .1s ease;
			&:focus {
				color: white;
				border-bottom: 1px solid white;
			}
		}
	}

	&.editable {
		background: rgba(120,120,120,0.3);
		img {
			transform: rotateZ(90deg);
		}
		.details {
			opacity: 0;
			transform: translateX(10px);
			max-height: 0;
		}
		.editbox {
			max-height: 10em;
		}
	}
}
</style>
