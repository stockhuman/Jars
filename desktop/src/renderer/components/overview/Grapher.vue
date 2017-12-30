<template>
	<div>
		<div id="graph" class="ct-chart"></div>
		<div id="graph-meta">
			<p></p>
<!-- 			<p>{{ds.commits.length}}</p> -->
		</div>
	</div>
</template>

<script>
import Chartist from 'chartist'

export default {
	name: 'grapher',
	computed: {},
	props: ['ds', 'ts'],
	watch: {
		ts: function () {
			this.setLabels()
			this.computePoints()
			let data = {
				lebels: this.labels,
				series: [this.series]
			}
			this.chart.update(data)
			console.log('chart-data--update:')
			console.log(this.labels)
			console.log(this.series)
		}
	},
	mounted () {
		this.setLabels()
		this.computePoints()

		console.log('chart-data--mounted:')
		console.log(this.labels)
		console.log(this.series)

		this.chart = Chartist.Line('#graph', {
			labels: this.labels,
			series: [this.series]
		}, {
			lineSmooth: Chartist.Interpolation.simple({
				tension: 0.2
			})
		})

		this.$on('tick', () => {
			this.setLabels()
			this.computePoints()
			this.chart.update()
			console.log('chart-data--tick:')
			console.log(this.labels)
			console.log(this.series)
		})
	},
	data: () => ({
		chart: undefined,
		labels: [],
		series: []
	}),
	methods: {
		setLabels: function () {
			switch (this.ts) {
			case 'today':
				// this.labels = ['Early morning', 'Morning', 'Midday', 'Afternoon', 'Evening', 'Night', ' Late Night']
				this.labels = ['EM', 'M', 'MD', 'AN', 'EV', 'N', 'LN']
				break
			}
		},
		computePoints: function () {
			this.lebels = []
			this.series = []
			if (this.ds.commits.length > 0) {
				switch (this.ts) {
				case 'today':
					let tods = [['ev', 0], ['m', 0], ['md', 0], ['an', 0], ['ev', 0], ['n', 0], ['ln', 0]]
					for (let i = this.ds.commits.length - 1; i >= 0; i--) {
						for (let e = tods.length - 1; e >= 0; e--) {
							if (tods[e][0] === this.ds.commits[i][3]) {
								tods[e][1] += parseFloat(this.ds.commits[i][2])
							}
						}
					}
					for (let i = 0; i < tods.length; i++) {
						this.series.push(tods[i][1])
					}
					break
				case 'month':
					// data = [this.ds.commits.length, parseFloat(this.ds.commits[i][2])]
					break
				case 'year':
				case 'all':
					// data = [this.ds.commits.length, (parseFloat(this.ds.commits[i][1] / h))]
					break
				}
			}
		}
	}
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#graph {
	background-color: transparent;
	padding-top: $u;
}

.ct-series-a {
	.ct-line {
		stroke: $color__blue;
		stroke-width: 2px;
		fill: transparent;
	}
}
.ct-labels {
	font-size: 12px;
	font-family: 'Hack', monospace;
	color: $color__grey;
}
.ct-grids {
	stroke: rgba($color__grey, 0.3);
	stroke-width: 1px;
}
.ct-vertical.ct-start {
	display: none;
}
</style>
