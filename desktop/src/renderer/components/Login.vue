<template>
	<div class="wrapper">
		<label for="db">Database URL</label>
		<input type="text" name="db" id="database-url" placeholder="https://your.api.endpoint">
		<button @click="save">start</button>
	</div>
</template>

<script>
import axios from 'axios'
import localforage from 'localforage'

export default {
	name: 'settings',
	methods: {
		save () { // starts the app
			const dburlin = document.getElementById('database-url')
			const prefs = {
				url: dburlin.value,
				theme: false
			}

			window.localstorage.setItem('prefs', prefs)

			localforage.setItem('prefs', prefs).then(() => {
				axios.get(dburlin.value + 'users/0').then(response => {
					axios.defaults.baseURL = dburlin.value
					localforage.setItem('user', response.data).then(response => {
						console.log(response)
						this.$router.push('/')
					})
				})
			})
		}
	}
}
</script>
