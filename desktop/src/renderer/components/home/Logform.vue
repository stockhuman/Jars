<template>
	<section class="log">
		<div class="live-update">{{this.msg}}</div>
		<input 
			type="text" 
			class="log-input"
			id="log" 
			placeholder="log time" 
			@focus="begin()" 
			@blur="abort()" 
			@keyup.enter="nextField()">
		<span class="commits-this-week">commited this week: {{hrs}}</span>
	</section>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
	name: 'logform',
	created () {
		console.log('hours commited @ created: ' + this.computeHours())
	},
	data: () => ({
		commit: {},
		msg: '',
		stage: 0,
		hrs: ''
	}),
	methods: {
		computeHours: function () {
			let hours = 0
			let thisWeek = ''

			// see https://github.com/mevdschee/php-crud-api
			for (let i = 1; i < 7; i++) {
				thisWeek += 'filter[]=date,eq,' +
					moment().startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD') +
					'&'
			}
			thisWeek += 'satisfy=any'

			axios.get('beans?' + thisWeek).then(response => {
				let r = response.data.beans.records

				for (let l = 0; l < r.length; l++) {
					hours += parseFloat(r[l][2])
				}
				if (hours < 1) {
					hours += ' minutes'
				} else if (hours === 1) {
					hours += ' hour'
				} else {
					hours += ' hours'
				}
				this.hrs = hours
			})
		},
		begin: function () {
			document.getElementById('log').placeholder = 'log time (press enter to commit)'
		},
		abort: function () {
			this.stage = 0
			document.getElementById('log').value = ''
			document.getElementById('log').placeholder = 'log time'
			this.msg = ''
		},
		nextField: function () {
			const form = document.getElementById('log')
			let txt = form.value

			if (this.stage === 0) {
				form.placeholder = 'time of day? (em|m|md|an|ev|n|ln)'

				const filterFloat = function (value) {
					if ((/^(\|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/).test(value)) {
						return Number(value)
					} else {
						return NaN
					}
				}
				if (!isNaN(filterFloat(txt))) {
					if (txt === '1') {
						this.msg += 'An hour '
					} else {
						this.msg += txt + ' hours '
					}
					this.commit.time = txt
				}
			}
			if (this.stage === 1) {
				form.placeholder = 'project'
				let humanTOD = ''

				switch (txt) {
				case 'em':
					humanTOD = 'in the early morning'
					break
				case 'm':
					humanTOD = 'in the morning'
					break
				case 'md':
					humanTOD = 'around midday'
					break
				case 'an':
					humanTOD = 'in the afternoon'
					break
				case 'ev':
					humanTOD = 'in the evening'
					break
				case 'n':
					humanTOD = 'around nighttime'
					break
				case 'ln':
					humanTOD = 'well past sundown'
					break
				}

				this.msg += humanTOD + ' working on '
				this.commit.tod = txt
			}
			if (this.stage === 2) {
				form.placeholder = 'task'
				this.commit.project = txt
				this.msg += txt + ' => '
			}
			if (this.stage === 3) {
				form.placeholder = 'work category'
				this.msg += txt + '. (cat: '
				this.commit.task = txt
			}
			if (this.stage === 4) {
				form.placeholder = 'comments?'
				this.msg += txt + ') '
				this.commit.cat = txt
			}
			if (this.stage === 5) {
				form.placeholder = 'Press Enter to commit this bean'
				if (txt !== '') this.msg += 'CMNT: ' + txt
				this.commit.comment = txt
			}

			if (this.stage <= 5) {
				form.value = ''
				this.stage += 1
				console.log('now on stage ' + this.stage)
			} else {
				form.placeholder = 'bean commited!'
				// commit!
				this.commit.date = moment().format('YYYY-MM-DD')
				this.msg = ''
				axios.post('beans/', this.commit)

				this.computeHours()
				this.hrs = ''
				window.setTimeout(function () {
					form.blur()
				}, 2000)
			}
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';

	.log {
		margin: $pu auto;
		max-width: 700px;
	}
	.log-input {
		width: 100%;
		padding: $pu / 2.5;
		border: none;
		font-size: $pu / 2;
		&::placeholder {
			color: $color__grey;
			font-family: "Helvetica Light";
		}
	}
	.commits-this-week {
		color: lighten($color__dark, 40%);
		font-size: 14px;
		font-style: italic;
		margin-top: 4px;
		display: block;
		text-align: right;
		font-family: "Helvetica Light";
	}
	.live-update {
		@extend .commits-this-week;
		text-align: left;
		margin-bottom: 4px;
	}
</style>
