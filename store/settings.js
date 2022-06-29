export const state = () => {
    return {
        show: false,
        id: null,
        settingsView: [],
        editingColorKey: null,
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

    setEditingColorKey(state, editingColorKey) {
        state.editingColorKey = editingColorKey;
    }


}

export const actions = {

    mapSettings({ commit }, settings) {

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
        commit('setSettingsView', settingsView);
    },

    async showSettings({ commit, dispatch }, id) {

        commit('setShow', true);
        commit('setId', id);

        let obj = await dispatch("scene/getObject", id, { root: true });
        await dispatch("mapSettings", obj.settings);

    },

    hideSettings({ commit }) {
        commit('setShow', false);
        commit('setId', null);
        commit('setSettingsView', []);
    },

    async applyColor({ dispatch, state, commit }, editingColorValue) {
        let obj = await dispatch("scene/getObject", state.id, { root: true });
        let color = obj.settings[state.editingColorKey].value;
        color.red = editingColorValue.rgba.r / 255;
        color.green = editingColorValue.rgba.g / 255;
        color.blue = editingColorValue.rgba.b / 255;

        obj.updateFromSettings();
        commit('setEditingColorKey', null);
        await dispatch("mapSettings", obj.settings);
    },
}
