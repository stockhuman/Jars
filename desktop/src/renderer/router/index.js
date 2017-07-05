import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'landing-page',
			component: require('@/components/pages/LandingPage')
		},
		{
			path: '/today',
			name: 'today-page',
			component: require('@/components/pages/TodayPage')
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
			path: '/account',
			name: 'account-page',
			component: require('@/components/pages/AccountPage')
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})
