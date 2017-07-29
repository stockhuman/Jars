<template>
	<div class="wrapper">
		<header class="header">
			<h1 class="title">{{yearData.year}}</h1>
			<hr />
		</header>
		<main>
			<section class="module">
				<p>{{yearData}}</p>
			</section>
		</main>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'test-page',
		computed: {
			state () {
				return this.$store.state
			}
		},
		data: () => ({
			errors: [],
			yearData: []
		}),
		created: function () {
			axios.get('years/')
			.then(response => {
				this.yearData = response.data
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
