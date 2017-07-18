<template>
	<div class="wrapper">
		<header class="header">
			<h1 class="title">Internaut CMS - v.0.0.1</h1>
			<hr />
		</header>
		<main>
			<section class="full-width module">
				<h4>Internaut location</h4>
				<input id="DBLoc" type="text" name="DBLoc" class="full-width">
			</section>
			<section class="module">
				<h4>Data</h4>
				<label for="filename">Filename</label>
				<input id="filename" type="text" name="filename"><br>
				<label for="filename">Title</label>
				<input id="title" type="text" name="title">
			</section>
			<section class="module">
				<h4>Control</h4>
				<button class="btn" @click="publish">Publish</button>
			</section>
			<section class="module full-width">
				<textarea name="body" id="body" rows="10" class="full-width"></textarea>
			</section>
		</main>
	</div>
</template>

<script>
import moment from 'moment'

export default {
	name: 'CMS-page',
	computed: {
		state () {
			return this.$store.state
		},
		date () {
			return moment().format('LLL')
		}
	},
	data: () => ({
		defaultLoc: 'C:/Users/Mike/Documents/GitHub/internaut/public/collection/writing/'
	}),
	created: function () {
		// C:\Users\Mike\Documents\GitHub\internaut\public\collection\writing\_data.json
		// document.getElementById('DBLoc')[0].value = 'ds'
	},
	methods: {
		publish () {
			let fs = require('fs')
			let path = this.defaultLoc

			fs.writeFile(path, document.getElementById('DBLoc').value, function (err, data) {
				if (err) {
					return console.log(err)
				}
				console.log(data)
			})
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';
</style>
