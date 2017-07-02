<template>
	<div class="container">
		<p>Year: {{annum.year}}</p>
		<p><strong>Goals:</strong></p>
		<ul>
			<li v-if="annum.year_goal_1 != ''">{{annum.year_goal_1}}</li>
			<li v-if="annum.year_goal_2 != ''">{{annum.year_goal_2}}</li>
			<li v-if="annum.year_goal_3 != ''">{{annum.year_goal_3}}</li>
		</ul>
		<p v-if="errors.length != 0">Errors: {{errors}}</p>

		<button v-on:click="createTask()">Create Task</button>
		<p v-if="createdData.length > 0">{{createdData}}</p>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		data: () => ({
			annum: [],
			errors: [],
			createdData: []
		}),

		created () {
			axios.get('http://localhost/api.jars.com/years/year/2017/')
			.then(response => {
				this.annum = response.data[0]
			})
			.catch(e => {
				this.errors.push(e)
			})
		},

		methods: {
			createTask: function () {
				let today = new Date()
				var dd = today.getDate() + Math.floor(Math.random() * 20)
				var mm = today.getMonth() + 1 // January is 0!
				var yyyy = today.getFullYear()

				if (dd < 10) {
					dd = '0' + dd
				}

				if (mm < 10) {
					mm = '0' + mm
				}

				axios.post('http://localhost/api.jars.com/days/', {
					day_date: yyyy + '-' + mm + '-' + dd,
					day_task_1: 'Doot me good',
					day_task_2: 'Doot me long',
					day_task_3: 'Doot me numb'
				})
				.catch(e => {
					this.errors.push(e)
				})
				// this.updateData()
			}

			// updateData: function () {
			// 	axios.get('http://localhost/api.jars.com/')
			// 	.then(response => {
			// 		this.createdData = response.data
			// 		console.log('Data Created: ' + response.data)
			// 	})
			// }
		}

	}
</script>

<style scoped>
	ul {
		list-style: decimal-leading-zero;
		list-style-position: inside;
		padding-bottom: 1em;
	}
</style>
