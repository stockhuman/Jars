<template>
	<div class="wrapper">
		<main>
			<h1 class="title">Week</h1>
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

	.title {
		color: #888;
		font-size: 18px;
		font-weight: initial;
		letter-spacing: .25px;
		margin-top: 10px;
	}

</style>
