<template>
	<div id="nav" :class="{ hidden: navIsHidden }">
		<ul>
			<li>	
				<div id="nav-toggle" class="nav-link" @click="toggleNav">
					<span></span>
					<span></span>
				</div>
			</li>
			<li v-for="item in items">
				<router-link :to="item.route" class="nav-link">
					<!-- <img :src="item.icon" v-bind:title="item.title"> -->
					<span class="nav-link-title">{{item.title}}</span>
				</router-link>
			</li>
		</ul>
		<div id="nav-panel">
			<nav-panel></nav-panel>
		</div>
	</div>
</template>

<script>
	import NavPanel from './Navigation/NavPanel'

	export default {
		name: 'navigation',
		components: { NavPanel },
		computed: {
			navIsHidden () {
				return this.$store.state.App.navIsHidden
			}
		},
		data: () => ({
			items: [{
				title: 'Home',
				route: '/home'
			},
			{
				title: 'Week',
				route: '/week',
				icon: 'static/ui/week.svg'
			},
			{
				title: 'Year',
				route: '/year',
				icon: 'static/ui/year.svg'
			}
			]
		}),
		methods: {
			toggleNav () { // admittedly this could be done in the @click directive
				this.$store.commit('TOGGLE_NAV')
			}
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';

	#nav {
		position: fixed;
		bottom: 0;
		height: $nav-height;
		background: #efefef;
		width: 100vw;
		z-index: 5;
		transition: bottom .3s ease;
	}

	ul {
		list-style: none;
		display: flex;
		li {
			width: 100%;
		}
	}

	.nav-link {
		display: block;
		// float: left;
		height: $nav-height + 0.2em;
		width: 100%;
		// width: $nav-height;
		color: #EAE0D5;
		text-decoration: none;
		text-align: center;
		font-size: 15px;
		transition: 0.15s background ease-in-out;

		&:hover {
			background: $color__blue;
		}

		&.router-link-active {
			border-bottom: 3px solid darken(#5E503F, 20%);
			&:hover {
				border: none;
			}
		}
		.nav-link-title {
			line-height: $nav-height;
			text-decoration: none;
			color: #222;
		}
	}

	$navPad: 10px; // determined by eye based on nav size. No ideal computed val found..

	#nav-toggle {
		cursor: pointer;
		height: $nav-height;
		width: $nav-height;
		margin-left: $nav-height / 3;
		margin-right: $nav-height / 3;
		position: relative;
		transform: rotateZ(90deg); // reversed logic for nav hiding, now hidden by default
		transition: transform .1s ease;

		&:hover { background: transparent; }

		span {
			position: absolute;
			height: 2px;
			width: calc(#{$nav-height} - #{$navPad *2}); // full width - padding at both sides
			background: #222;
			

			&:nth-child(1) {
				top: $navPad*1.4;
				left: $navPad;
			}

			&:nth-child(2) {
				top: $navPad*2.4;
				left: $navPad;
			}

			&:nth-child(3) {
				top: $navPad*3.4;
				left: $navPad;
			}
		}
	}

	#nav.hidden #nav-toggle {
		transform: rotateZ(0deg);
	}

	#nav-panel {
		position: fixed;
		left: 0;
		top: 0;
		background: white;
		width: 16em;
		height: 100vh;
		z-index: -2;
		transition: left .4s ease-in-out;
	}

	.hidden #nav-panel {
		left: -100%;
	}


</style>
