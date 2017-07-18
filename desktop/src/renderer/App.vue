<template>
	<div id="app">
		<navigation></navigation>
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
	import navigation from './components/Navigation'
	// import notes from './components/Notes'

	export default {
		name: 'desktop',
		// components: { navigation, notes },
		components: { navigation },
		computed: {
			store () { return this.$store }
		},

		// Add global keyboard event listener
		mounted: function () {
			document.addEventListener('keyup', (e) => {
				if (e.keyCode === 45) { // "n" or Insert Key
					this.store.commit('TOGGLE_NOTES')
				}
				if (e.keyCode === 192 || e.keyCode === 36) { // "~" or Home key
					this.store.commit('TOGGLE_NAV')
				}
				if (e.keyCode === 112) { // F1
					this.$router.push('/CMS')
				}
				if (e.shiftKey) { // sans-nav navigation
					switch (e.keyCode) {
					case 48: this.$router.push('/')
						break
					case 49: this.$router.push('/today')
						break
					case 50: this.$router.push('/week')
						break
					case 51: this.$router.push('/year')
						break
					}
				}
			})
		}
	}
</script>

<style src='./assets/base.scss' lang="scss"></style>
<style lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition-property: opacity;
		transition-duration: .15s;
	}
	.fade-enter-active {
		transition-delay: .25s;
	}
	.fade-enter, .fade-leave-active {
		opacity: 0
	}
</style>
