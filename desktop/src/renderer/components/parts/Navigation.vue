<template>
	<div id="nav">
		<ul class="nav-links">
			<li v-for="item in items" v-if="item.route !== $route.path">
				<router-link :to="item.route" class="nav-link">
					<span class="nav-link-title">{{item.title}}</span>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>

	export default {
		name: 'navigation',
		data: () => ({
			items: [{
				title: 'Home',
				route: '/home'
			},
			{
				title: 'Settings',
				route: '/settings'
			},
			{
				title: 'Overview',
				route: '/overview'
			}
			]
		})
	}
</script>
