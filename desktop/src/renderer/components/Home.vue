<template>
	<div class="wrapper">
		<h3 class="week-of-the-year" v-html="weekInfo"></h3>
		<main id="home-view">
			<events :wkc="this.weekcode"></events>
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
			let notice = ''

			if (this.offset > 0) {
				notice = ' (' + this.offset + ' week'
				if (this.offset !== 1) {
					notice += 's'
				}
				notice += ' ahead)'
			} else if (this.offset < 0) {
				notice = ' (' + Math.abs(this.offset) + ' week'
				if (this.offset !== -1) {
					notice += 's'
				}
				notice += ' ago)'
			}

			return 'Week of the ' +
				moment(this.weekcode, 'YYYYWW').startOf('isoWeek').format('Do') +
				' to ' +
				moment(this.weekcode, 'YYYYWW').endOf('isoWeek').format('Do') +
				'<span class="week-info">' + notice + '</span>'
		}
	},
	data: () => ({
		offset: 0,
		weekcode: '' + moment().year() + moment().isoWeek() // '201740'
	}),
	created () {
		document.addEventListener('keyup', (e) => {
			if (e.ctrlKey === true) {
				if (e.key === 'ArrowRight') {
					this.offset += 1
					this.switchWeek()
				} else if (e.key === 'ArrowLeft') {
					this.offset -= 1
					this.switchWeek()
				}
			}
		})

		this.$on('tick', () => {
			this.weekcode = '' + moment().year() + moment().isoWeek() // '201740'
		})
	},
	methods: {
		switchWeek: function () {
			let wkc = moment()
			if (this.offset > 0) {
				wkc.add(this.offset, 'week')
			} else {
				wkc.subtract(Math.abs(this.offset), 'week')
			}
			this.weekcode = '' + wkc.year() + wkc.isoWeek()
		}
	}
}
</script>
