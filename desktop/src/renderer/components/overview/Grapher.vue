<template>
	<div>
	</div>
</template>

<script>
export default {
	name: 'grapher',
	computed: {},
	props: ['ds', 'ts'],
	watch: {
		ts: function () {}
	},
	mounted () {
		this.setLabels()
		this.computePoints()
		this.$on('tick', () => {})
	},
	data: () => ({
		chart: undefined,
		labels: [],
		series: []
	}),
	methods: {
		setLabels () {},
		computePoints () {}
	}
}
</script>

<style lang="scss">
</style>
