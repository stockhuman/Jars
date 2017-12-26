<template>
	<div id="app">
		<top></top>
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
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
<style lang="scss">
	@import './assets/scss/variables';
	.fade-enter-active, .fade-leave-active {
		transition-property: opacity;
		transition-duration: .15s;
	}
	.fade-enter-active {
		transition-delay: .25s;
		position: fixed;
		width: 100vw;
		height: 100vh;
	}
	.fade-enter, .fade-leave-active {
		opacity: 0
	}
</style>
