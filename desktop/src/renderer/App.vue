<template>
	<div id="app">
		<div v-if="this.initialized">
			<masthead></masthead>
			<transition name="fade">
				<router-view></router-view>
			</transition>
			<logform></logform>
		</div>
		<div v-else>
			<setup></setup>
		</div>
	</div>
</template>

<script>
	import masthead from './components/parts/Header'
	import logform from './components/parts/Logform'
	import setup from './components/Setup'
	import localforage from 'localforage'

	export default {
		name: 'desktop',
		components: { masthead, logform, setup },
		data: () => ({
			timer: [],
			initialized: false
		}),

		created: function () {
			localforage.getItem('jar').then(data => {
				if (data !== null) {
					if (data.ready) { this.initialized = true }
				}
			})

			this.$on('ready', () => { this.initialized = true })
		},

		mounted: function () {
			// Add global keyboard event listener
			document.addEventListener('keyup', (e) => {
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
