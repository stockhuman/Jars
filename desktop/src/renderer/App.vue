<template>
	<div id="app">
		<top></top>
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
	import localforage from 'localforage'
	import axios from 'axios'
	import top from './components/parts/Header'

	export default {
		name: 'desktop',
		components: { top },
		computed: {
			store () { return this.$store }
		},
		data: () => ({
			timer: []
		}),
		created: function () {
			localforage.getItem('prefs').then(prefs => {
				if (prefs === null) {
					this.$router.push('/login')
				} else {
					axios.defaults.baseURL = prefs.url
					console.log(axios.defaults)
				}
			})
		},
		// Add global keyboard event listener
		mounted: function () {
			document.addEventListener('keyup', (e) => {
				// if (e.keyCode === 45) { // "n" or Insert Key
				// 	this.store.commit('TOGGLE_NOTES')
				// }
				if (e.altKey) { // sans-nav navigation
					switch (e.keyCode) {
					case 48: this.$router.push('/')
						break
					case 49: this.$router.push('/overview')
						break
					case 50: this.$router.push('/settings')
						break
					}
				}
			})

			// Set reccuring event to refresh content
			this.timer = setTimeout(this.refresh(), 300000) // five minutes
		},
		methods: {
			refresh: function () {
				this.$root.$emit('tick')
				this.timer = setTimeout(this.refresh, 300000)
			}
		}
	}
</script>

<style src='./assets/base.scss' lang="scss"></style>
