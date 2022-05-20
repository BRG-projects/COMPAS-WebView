export const state = () => {
    return {
        showController: true,
    }
}

export const mutations = {

    setShowController(state, showController) {
        state.showController = showController
    },
}

export const actions = {
    toggleController({ state, commit }) {
        commit('setShowController', !state.showController)
        console.log(state.showController)
    }
}