import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost/api.jars.com/'

new Vue({ // eslint-disable-line
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
