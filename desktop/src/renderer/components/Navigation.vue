<template>
	<div id="nav">
		<ul>
			<li v-for="item in items">
				<router-link :to="item.route" class="nav-link">
					<img :src="item.icon" v-bind:title="item.title">
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'navigation',

		mounted: () => {
			// this is cheating, but I need it to be global
			document.onkeydown = function (evt) {
				evt = evt || window.event
				if (evt.keyCode === 36) { // home key
					if (this.navIsHidden) {
						document.getElementById('nav').classList = ''
					} else {
						document.getElementById('nav').classList = 'hidden'
					}
					this.navIsHidden = !this.navIsHidden
				}
			}
		},

		data: () => ({
			navIsHidden: false,
			items: [{
				title: 'Today',
				route: '/',
				icon: 'static/ui/day.svg'
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
			},
			{
				title: 'Account',
				route: '/account',
				icon: require('../assets/img/user.jpg')
			}
			]
		})
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';

	#nav {
		position: fixed;
		left: 0;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		width: $nav-width;
		box-shadow: 4px 0px 72px -20px rgba(0,0,0,0.75);
		transition: left .3s ease;
		&.hidden {
			left: -5em;
		}
	}

	ul {
		list-style: none;
	}

	.nav-link {
		display: block;
		float: left;
		height: $nav-width;
		width: $nav-width;
		border-bottom: 1px solid #222;
		color: #eee;
		text-decoration: none;
		text-align: center;
		transition: 0.15s background ease-in-out;

		&:hover {
			background: rgba(198, 172, 143, 0.7);
			img {

			}
		}

		img {
			width: 100%;
			padding: 1.7em; // magic numbers! 
		}

		// account pic
		&[href='#/account'] {
			position: fixed;
			bottom: 0;
			border-top: 1px solid #222;
			border-bottom: none;

			img {
				padding: 0;
				border-radius: 50%;
				border: 1px #555 solid;
				margin: 1em;
				width: 3em; // magic numbers everywhere!
			}
		}
	}
</style>
