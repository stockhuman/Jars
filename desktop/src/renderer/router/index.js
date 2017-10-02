import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/home',
			name: 'home-page',
			component: require('@/components/Home')
		},
		{
			path: '/overview',
			name: 'overview-page',
			component: require('@/components/Overview')
		},
		{
			path: '/settings',
			name: 'settings-page',
			component: require('@/components/Settings')
		},
		{
			path: '*',
			redirect: '/home'
		}
	]
})
