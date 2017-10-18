<template>
	<div class="wrapper">
		<h3 class="week-of-the-year">{{weekInfo}}</h3>
		<main>
			<events></events>
			<logform></logform>
		</main>
	</div>
</template>

<script>
import moment from 'moment'
import logform from './home/Logform'
import events from './home/Events'

export default {
	name: 'today-page',
	components: { logform, events },
	computed: {
		weekInfo () {
			// TODO: does not update, moment.js is not reactive?
			return 'Week of the ' +
				moment().startOf('isoWeek').format('Do') +
				' to ' +
				moment().endOf('isoWeek').format('Do')
		}
	}
}
</script>
