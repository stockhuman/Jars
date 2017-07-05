<template>
	<div class="wrapper">
		<main>
			<h1 class="title">Year Page</h1>
			<p>{{state.Profile.testState}}</p>
		</main>
	</div>
</template>

<script>
	export default {
		name: 'test-page',
		computed: {
			state () {
				return this.$store.state
			}
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';

</style>
