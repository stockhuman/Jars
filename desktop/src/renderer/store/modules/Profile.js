const state = {
	testState: 42
}

const mutations = {
	DECREMENT_STATE (state) {
		state.testState--
	},
	INCREMENT_STATE (state) {
		state.testState++
	}
}

const actions = {
	someAsyncTask ({ commit }) {
		// do something async
		commit('INCREMENT_MAIN_COUNTER')
	}
}

export default {
	state,
	mutations,
	actions
}
