<template>
	<div class="wrapper">
		<header class="header">
			<h1 class="title">{{week}}</h1>
			<hr />
		</header>
		<main>
			<section class="module left-side week-calendar">
				<p class="day">Monday</p>
				<p class="day">Tuesday</p>
				<p class="day">Wednesday</p>
				<p class="day">Thursday</p>
				<p class="day">Friday</p>
				<p class="day">Saturday</p>
				<p class="day">Sunday</p>
			</section>
			<section class="module right-side">
				<h4>This week's goals</h4>
				<ul>
					<li>{{weekData.week_goal_1}}</li>
					<li>{{weekData.week_goal_2}}</li>
					<li>{{weekData.week_goal_3}}</li>
				</ul>
			</section>
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
		weekData: []
	}),
	created: function () {
		axios.get('weeks/')
		.then(response => {
			this.weekData = response.data
		})
		.catch(e => {
			this.errors.push(e)
		})
	}
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';
@import '../../assets/scss/mixins';

.day {
	font-weight: 700;
}
</style>
