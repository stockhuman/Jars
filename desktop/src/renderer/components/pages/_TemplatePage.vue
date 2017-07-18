<template>
	<div class="wrapper">
		<header class="header">
			<h1 class="title">{{date}}</h1>
			<hr />
		</header>
		<main>
			<section class="left-side module">
			</section>
		</main>
	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
	name: 'today-page',
	computed: {
		state () {
			return this.$store.state
		},
		date () {
			return moment().format('LLL')
		}
	},
	data: () => ({
		errors: [],
		days: []
	}),
	created: function () {
		axios.get('http://localhost/api.jars.com/days')
		.then(response => {
			this.days = response.data[0]
		})
		.catch(e => {
			this.errors.push(e)
		})
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';
</style>
