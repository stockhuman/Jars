<template>
	<div class="wrapper">
	</div>
</template>

<script>
// TODO: build me
export default {
	name: 'overview',
<<<<<<< HEAD
<<<<<<< HEAD
	components: { grapher },
	computed: {
		timescale: function () {
			switch (this.showme) {
			case 'today': return moment().format('dddd, MMMM Do')
			case 'month': return moment().format('MMMM YYYY')
			case 'year': return moment().year()
			case 'all': return 'All time'
			}
		},
		committed: function () {
			let str = this.tsData.commits.length
			let hours = 0 // compute hours total

			if (str !== 0) {
				if (this.showme === 'today' || this.showme === 'month') {
					for (let i = this.tsData.commits.length - 1; i >= 0; i--) {
						hours += parseFloat(this.tsData.commits[i][2])
					}
				} else {
					for (let i = this.tsData.commits.length - 1; i >= 0; i--) {
						hours += parseFloat(this.tsData.commits[i][1])
					}
				}
				if (str === 1) {
					str += ' commit, '
				} else {
					str += ' commits, '
				}
				if (hours < 1) {
					hours = 60 * hours
					hours += ' minutes'
				} else if (hours === 1) {
					hours += ' hour'
				} else {
					hours += ' hours'
				}
				str += ' ' + hours
			} else {
				str = 'No commits'
			}
			this.tsData.hours = hours

			return str
		}
	},
	methods: {
		switchView: function (view) {
			this.showme = view
			this.getData()
		},
		tab: function (tab) {
			return this.showme === tab
		},
		getData: function () {
			let qs = 'beans?filter=date,'

			// note that data efficiency pragmatism necessitates a different
			// schema depending on selected time range
			switch (this.showme) {
			case 'today': qs += 'eq,' + moment().format('YYYY-MM-DD')
				break
			case 'month': qs += 'sw,' + moment().format('YYYY-MM')
				qs += '&exclude=comment'
				break
			case 'year': qs += 'sw,' + moment().year()
				qs += '&columns=date,time,project,cat'
				break
			case 'all': qs += 'sw,2' // this millenium
				qs += '&columns=date,time,project,cat'
				break
			}

			axios.get(qs).then(response => {
				const d = response.data.beans.records
				const m = response.data.beans.columns
				let cat = 0
				let prj = 0 // TODO: use maps instead of this while loop thing

				while (m[cat] !== 'cat') { cat++ }
				while (m[prj] !== 'project') { prj++ }

				this.tsData = {
					events: [], // beans tagged "life"
					commits: [], // beans not tagged "life"
					goals: [],
					projects: []
				}

				let prjTemp = []

				for (let i = d.length - 1; i >= 0; i--) {
					if (d[i][cat] === 'Events') {
						this.tsData.events.push(d[i])
					} else {
						this.tsData.commits.push(d[i])
					}
					// get projects within the time period
					if (d[i][prj] !== 'life') {
						prjTemp.push(d[i][prj])
					}
				}
				// Filter for unique entries
				prjTemp = Array.from(new Set(prjTemp))
				this.tsData.projects.push(prjTemp)
			})
		}
	},
	data: () => ({
		showme: 'today',
		tsData: {
			events: [], // beans tagged "life"
			commits: [], // beans not tagged "life"
			goals: [],
			projects: [],
			hours: 0
		},
		weekcode: '' + moment().year() + moment().isoWeek()
	}),
	created () {
		this.getData()

		this.$on('tick', () => {
			this.weekcode = '' + moment().year() + moment().isoWeek() // '201740'
		})
	}
=======
	computed: {},
	methods: {}
>>>>>>> parent of 411d4d0... Built Overview MVP
=======
	computed: {},
	methods: {}
>>>>>>> parent of 411d4d0... Built Overview MVP
}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
<<<<<<< HEAD
<<<<<<< HEAD

	.overview-timescales {
		text-align: center;
		position: fixed;
		bottom: $pu;
		width: 100%;
	}

	#overview-meta {
		text-align: right;
		p {
			color: $color__grey;
		}
	}
=======
>>>>>>> parent of 411d4d0... Built Overview MVP
=======
>>>>>>> parent of 411d4d0... Built Overview MVP
</style>
