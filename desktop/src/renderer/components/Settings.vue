<template>
	<div class="wrapper">
		<section class="account-info">
			<img id="account-image" src="~@/assets/img/user.jpg" alt="User Account image">
			<h1 class="item name">{{account.user_nicename}}</h1>
			<p class="item name">User: {{account.user_name}}</p>
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
				<button class="alt" @click="open('https://github.com/stockHuman/Jars/wiki')">Jars Documentation</button>
			</div>
			
		</section>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'settings',
	methods: {
		open (link) {
			this.$electron.shell.openExternal(link)
		}
	},

	data: () => ({
		account: [],
		tasks: 0,
		errors: [],
		electron: process.versions['atom-shell'],
		node: process.versions.node,
		platform: require('os').platform(),
		vue: require('vue/package.json').version
	}),

	created () {
		axios.get('users/0')
		.then(response => {
			this.account = response.data
		})
		.catch(e => {
			this.errors.push(e)
		})
	}
}
</script>

<style lang="scss">
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

#account-image {
	border-radius: 50%;
	width: 7em;
	height: 7em;
	margin-bottom: $u;
}

.item {
	display: flex;
	margin-bottom: 6px;
}

.name {
	color: #6a6a6a;
	margin-right: 6px;
}

.item .value {
	color: $color__blue;
	font-weight: bold;
}

.one-half > button {
	margin: .9em 0;
}
</style>
