export const state = () => {
    return {
        show: false,
        id: null,
        settingsView: [],
    }
}

export const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setId(state, id) {
        state.id = id;
    },

    setSettingsView(state, settingsView) {
        state.settingsView = settingsView;
    },


}

export const actions = {
    showSettings({ commit }, { id, settings }) {
        const settingsView = [];
        for (const [key, value] of Object.entries(settings)) {
            if (value.dtype === "compas.colors/Color") {
                settingsView.push({
                    key: key,
                    color: `rgb(${value.value.red * 255}, ${value.value.green * 255}, ${value.value.blue * 255})`,
                });
            } else {
                settingsView.push({
                    key: key,
                    value: JSON.stringify(value),
                });
            }
        }
        
        commit('setShow', true);
        commit('setId', id);
        commit('setSettingsView', settingsView);
    },

    hideSettings({ commit }) {
        commit('setShow', false);
        commit('setId', null);
        commit('setSettingsView', []);
    }
}
