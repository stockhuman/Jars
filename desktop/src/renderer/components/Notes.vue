<template>
	<div id="notes" :class="{hidden: notesAreHidden}">
		<h1 class="title" @keyup.enter="updateNotes">Notes</h1>
		<hr />
		<textarea id="notesInput" :value="note" v-model="note" @keydown="autoSize"></textarea>
		<button class="btn" @click="updateNotes">save</button>
		<p v-if="errors.length > 0">{{errors}}</p>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'notes',
		data: () => ({

			note: '',
			errors: []
		}),
		computed: {
			state () {
				return this.$store.state
			},
			notesAreHidden () {
				return this.$store.state.App.notesAreHidden
			}
		},

		created: function () {
			axios.get('http://localhost/api.jars.com/life')
			.then(response => {
				this.note = response.data[response.data.length - 1].life_notes_large
			})
			.catch(e => {
				this.errors.push(e)
			})
		},
		methods: {
			updateNotes: function () {
				axios.post('http://localhost/api.jars.com/life', {
					life_notes_large: this.note
					// headers: {
					// 	'Accept': 'application/json'
					// }
				})
				.then((response) => {
					console.log(response)
				})
				.catch((error) => {
					console.warn(error)
				})
			},
			autoSize () {
				let el = document.getElementById('notesInput')
				setTimeout(function () {
					el.style.cssText = 'height:auto; padding:0'
					el.style.cssText = 'height:' + el.scrollHeight + 'px'
				}, 0)
			}
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';

	$notes-pad: 1em;

	#notes {
		position: fixed;
		left: $nav-width + $notes-pad;
		top: calc(41vh + #{$notes-pad});
		bottom: 0;
		height: 69vh;
		right: $notes-pad;

		padding: 2em;
		border-radius: 2px;

		background: rgba(250, 250, 250, 0.97);
		
		box-shadow: -1px -5px 22px 4px rgba(0,0,0,0.26);
		transition: all .3s ease;
		&.hidden {
			top: 105%;
		}

		h1 {
			color: black;
		}

		#notesInput {
			background: transparent;
			border: none;
			width: 100%;
			font-size: 16px;
			max-height: 40vh
		}
	}
	#nav.hidden ~ #notes {
		left: $notes-pad;
	}
</style>
