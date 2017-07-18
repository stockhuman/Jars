const state = {
	navIsHidden: true,
	notesAreHidden: true
}

const getters = {
	nav: state => () => state.navIsHidden,
	notes: state => () => state.notesAreHidden
}

const mutations = {
	TOGGLE_NAV (state) {
		state.navIsHidden = !state.navIsHidden
	},
	TOGGLE_NOTES (state) {
		state.notesAreHidden = !state.notesAreHidden
	}
}

const actions = {
	// someAsyncTask ({ commit }) {
	// 	// do something async
	// 	commit('INCREMENT_MAIN_COUNTER')
	// }
}

export default {
	state,
	getters,
	mutations,
	actions
}
