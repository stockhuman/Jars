<template>
	<div id="app">
		<navigation></navigation>
		<router-view></router-view>
	</div>
</template>

<script>
	import navigation from './components/Navigation'

	export default {
		name: 'desktop',
		components: { navigation }
	}
</script>

<style src='./assets/base.scss' lang="scss"></style>
