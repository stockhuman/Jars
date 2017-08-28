import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/home',
			name: 'home-page',
			component: require('@/components/pages/HomePage')
		},
		{
			path: '/week',
			name: 'week-page',
			component: require('@/components/pages/WeekPage')
		},
		{
			path: '/year',
			name: 'year-page',
			component: require('@/components/pages/YearPage')
		},
		{
			path: '/CMS',
			name: 'CMS-page',
			component: require('@/components/pages/CMS')
		},
		{
			path: '*',
			redirect: '/home'
		}
	]
})
