export const state = () => {
    return {
        showController: true,
        scene: null,
    }
}

export const mutations = {

    setShowController(state, showController) {
        state.showController = showController
    },

    setScene(state, scene) {
        state.scene = scene
    }
}

export const actions = {
    toggleController({ state, commit }) {
        commit('setShowController', !state.showController)
        console.log(state.showController)
    }
}