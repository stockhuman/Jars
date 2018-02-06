<template>
	<div class="wrapper">
		<header id="setup-header">
			<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
				<!-- base -->
				<circle fill="#FFFFFF" cx="64" cy="64" r="64"/>
				<g>
					<defs><rect id="mask" width="32" height="128"/></defs>
					<clipPath id="clip"><use xlink:href="#mask"/></clipPath>
					<circle class="st1" cx="64" cy="64" r="64" fill="#00AEEF" clip-path="url(#clip)"/>
				</g>
			</svg>
			<div class="welcome-block">
				<h1>Jars {{version}}</h1>
			</div>
		</header>
		<main id="setup-form">
			<h2>Setup</h2>
			<div class="col">
				<div class="row">
					<label for="server">Server Address</label>
					<input type="text" id="server" name="server" :placeholder="jar.server_url || 'http://...'">
				</div>
				<div class="row">
					<label for="calendar">Google Calendar</label>
					<input type="text" id="calendar" name="calendar"></div>
				<div class="row">
					<label for="name">Your Name</label>
					<input type="text" id="name" name="name" :placeholder="jar.name || 'hello, there!'">
				</div>
			</div>
			<div class="col">
				<div class="row">
					<button @click="test">test</button>
					<button class="alt" @click="save">save</button>
				</div>
				<p class="hack code">{{info}}</p>
			</div>
		</main>
		<aside>
			<h4>About</h4>
			<p>Jars is a ...</p>
		</aside>
	</div>
</template>

<script>
import localforage from 'localforage'
import axios from 'axios'

export default {
	name: 'setup',
	methods: {
		open (link) {
			this.$electron.shell.openExternal(link)
		},

		test () {
			axios.get(document.getElementById('server').value + 'users').then(r => {
				this.info = 'Server: ' + r.status + ', ' + r.statusText
			})
		},

		save () {
			let data = {
				name: document.getElementById('name').value,
				server_url: document.getElementById('server').value,
				ready: true
			}
			localforage.setItem('jar', data).then(r => {
				this.$emit('ready')
			})
		}
	},

	created: function () {
		localforage.getItem('jar').then(r => {
			this.jar = r
		})
	},

	data: () => ({
		jar: {},
		info: '',
		tasks: 0,
		version: window.require('electron').remote.app.getVersion()
	})
}
</script>

<style lang="scss">
@import '../assets/scss/variables';

#setup-header {
	-webkit-app-region: drag;
	width: 100%;
	margin-bottom: $u;
	svg {
		width: 3em;
		height: 3em;
		display: inline-block;
		margin-right: $u;
	}
	.welcome-block {
		display: inline-block;
		h1 {
			margin-top: -2rem;
		}
	}
}

#setup-form {

	.col {
		display: flex;
		flex-wrap: row;
		margin-top: $u;
		.row {
			padding-top: $u / 2;
			margin-right: $u;
			label, input {
				display: block;
			}
			label {
				font-size: 12px;
				padding-bottom: 4px;
			}
			input {
				padding: 10px;
				border-radius: 4px;
				border: 1px solid transparent;
				width: 100%;
				&:focus {
					border: 1px solid $color__blue;
				}
			}
		}
	}
}

</style>
