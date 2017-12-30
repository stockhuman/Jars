<template>
	<div>
	</div>
</template>

<script>
export default {
	name: 'template',
	computed: {},
	created () {
		// axios.get('users/0').then(response => {
		// 	this.account = response.data
		// }).catch(e => { this.account = { user_nicename: ' ' } })

		this.$on('tick', () => {})
	},
	data: () => ({}),
	methods: {}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';
</style>
