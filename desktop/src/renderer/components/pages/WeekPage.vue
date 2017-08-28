<template>
	<div class="wrapper">
		<header class="header">
			<h1 class="title">{{week}}</h1>
			<hr />
		</header>
		<main>
			<section class="week-calendar">
				<p class="day">Monday</p>
				<input type="text">
				<p class="day">Tuesday</p>
				<input type="text">
				<p class="day">Wednesday</p>
				<input type="text">
				<p class="day">Thursday</p>
				<input type="text">
				<p class="day">Friday</p>
				<input type="text">
				<p class="day">Saturday</p>
				<input type="text">
				<p class="day">Sunday</p>
				<input type="text">
			</section>
			<div>
				{{thisWeek}}
			</div>
		</main>
	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
	name: 'test-page',
	computed: {
		state () {
			return this.$store.state
		},
		week () {
			return 'Week of the ' +
				moment().startOf('isoWeek').format('Do') +
				' to ' +
				moment().endOf('isoWeek').format('Do')
		}
	},
	data: () => ({
		errors: [],
		weekData: [],
		thisWeek: []
	}),
	created: function () {
		axios.get('weeks/')
		.then(response => {
			let weeksOnRecord = response.data.weeks.records.length
			this.weekData = response.data.weeks.records
			this.thisWeek = response.data.weeks.records[weeksOnRecord - 1]
		})
		.catch(e => {
			console.warn(e)
		})
	}
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';
@import '../../assets/scss/mixins';

.week-calendar {
	background: #eee;
	width: 100%;
}


</style>
