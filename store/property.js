export const state = () => {
    return {
        id: null,
        properties: [],
    }
}

export const mutations = {

    setId(state, id) {
        state.id = id
    },

    setProperties(state, properties) {
        state.properties = properties
    }
}

export const actions = {
    showProperties({ commit }, { id, properties }) {
        commit('setId', id || null);
        commit('setProperties', properties || []);
    }
}
