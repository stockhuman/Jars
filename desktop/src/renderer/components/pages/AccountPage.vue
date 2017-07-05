<template>
	<div class="wrapper">
		<img id="account-image" src="~@/assets/img/user.jpg" alt="User Account image">
		<section class="account-info">
			<h1 class="item">{{account.user_nicename}}</h1>
			<p class="item name">User: {{account.user_name}}</p>
			<p class="item name">Days on Record: {{daysTotal}}</p>
		</section>

		<section class="device-info">
			<hr />

			<div class="one-half">
				<h2 class="title">Information</h2>
				<div class="items">
					<div class="item">
						<div class="name">Vue.js:</div>
						<div class="value">{{ vue }}</div>
					</div>
					<div class="item">
						<div class="name">Electron:</div>
						<div class="value">{{ electron }}</div>
					</div>
					<div class="item">
						<div class="name">Node:</div>
						<div class="value">{{ node }}</div>
					</div>
					<div class="item">
						<div class="name">Platform:</div>
						<div class="value">{{ platform }}</div>
					</div>
				</div>
			</div>

			<div class="one-half">
				<button class="alt" @click="open('https://electron.atom.io/docs/')">Jars Documentation</button>
			</div>
			
		</section>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'test-page',
		methods: {
			open (link) {
				this.$electron.shell.openExternal(link)
			}
		},

		data: () => ({
			account: [],
			daysTotal: 0,
			errors: [],
			electron: process.versions['atom-shell'],
			node: process.versions.node,
			platform: require('os').platform(),
			vue: require('vue/package.json').version
		}),

		created () {
			axios.get('http://localhost/api.jars.com/users/')
			.then(response => {
				this.account = response.data[0]
			})
			.catch(e => {
				this.errors.push(e)
			})

			axios.get('http://localhost/api.jars.com/days')
			.then(response => {
				this.daysTotal = response.data.length
			})
			.catch(e => {})
		}
	}
</script>

<style scoped>
	.account-info, .device-info {
		padding-top: 5em;
		color: #eee;
	}

	#account-image {
		border-radius: 50%;
		width: 20vw;
		height: 20vw;
		display: block;
		margin: 0 auto;
	}

	.title {
		color: #888;
		font-size: 18px;
		font-weight: initial;
		letter-spacing: .25px;
		margin-top: 10px;
	}

	.items { margin-top: 8px; }

	.item {
		display: flex;
		margin-bottom: 6px;
	}

	.name {
		color: #6a6a6a;
		margin-right: 6px;
	}

	.item .value {
		color: #35495e;
		font-weight: bold;
	}

	.one-half {
		display: block;
		float: left;
		width: 50%;
	}

	.one-half > button {
		margin: .9em 0;
		width: 100%;
	}
</style>
