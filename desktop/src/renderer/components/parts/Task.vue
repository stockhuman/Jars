<template>
	<article class="task" :class="{editable: editable, dismissed: dismissed}" @click.self="expand">
		<span class="task-edit"></span>
		<h2 contenteditable="{true: editable}" @input="update" class="task-title">{{task.title}}</h2>
		<p class="details">{{details}}</p>
		<div class="editbox">
			<div class="row">
				<input @input="update" v-model="task.time" name="time" size="8">
				<input @input="update" v-model="task.date" name="date" type="date">
				<input @input="update" v-model="task.tags" name="tags" placeholder="no tags">
			</div>
			<div class="row actions">
				<button @click="expand">Done Editing</button>
				<button @click="dismiss" class="alt">Mark Completed</button>
			</div>
		</div>
		<!-- <p style="color: lightgreen">{{task}}</p> -->
	</article>
</template>

<script>

export default {
	name: 'task',
	data: () => ({
		editable: false,
		dismissed: false
	}),
	computed: {
		details () {
			let detailsString = '@ ' + this.task.time
			if (this.task.tags[0] !== '') {
				detailsString += ' => ' + this.task.tags
			}
			return detailsString
		}
	},
	props: ['task'],
	methods: {
		expand: function (event) {
			this.editable = !this.editable
		},
		update: function (event) {
			let e = event.target.localName
			var params = {}

			if (e === 'h2') {
				params.title = event.target.innerText
			}
			if (e === 'input') {
				if (event.target.name === 'time') {
					params.time = event.target.value
				}
				if (event.target.name === 'date') {
					params.date = event.target.value
				}
				if (event.target.name === 'tags') {
					params.tags = event.target.value.replace(/[, ]+$/, '')
				}
			}

			this.$parent.$emit('edit', [this.task.task, params])
		},
		dismiss: function () {
			this.dismissed = true
			this.$parent.$emit('dismiss', this.task.task)
		}
	}
}
</script>
