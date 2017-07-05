const state = {
	navIsHidden: false
}

const mutations = {
	TOGGLE_NAV (state) {
		state.navIsHidden = !state.navIsHidden
	}
	// INCREMENT_MAIN_COUNTER (state) {
	// 	state.main++
	// }
}

const actions = {
	// someAsyncTask ({ commit }) {
	// 	// do something async
	// 	commit('INCREMENT_MAIN_COUNTER')
	// }
}

export default {
	state,
	mutations,
	actions
}
