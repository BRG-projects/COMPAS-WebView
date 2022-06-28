export const state = () => {
    return {
        show: false,
        dataView: [],
    }
}

export const mutations = {

    setShow(state, show) {
        state.show = show;
    },

    setDataView(state, dataView) {
        state.dataView = dataView;
    }

}

export const actions = {
    showData({ commit }, data) {
        let id = 0;

        let mapData = (data) => {
            let dataView = [];

            for (const [key, value] of Object.entries(data)) {
                if (Array.isArray(value)) {
                    dataView.push({
                        id: id++,
                        name: `${key} : []`,
                        children: mapData(value),
                    });
                } else if (typeof value === "object" && value) {
                    dataView.push({
                        id: id++,
                        name: `${key} : {}`,
                        children: mapData(value),
                    });
                } else {
                    dataView.push({
                        id: id++,
                        name: `${key} : ${value}`,
                    });
                }
            }

            return dataView;
        };

        commit('setShow', true);
        commit('setDataView', mapData(data));
    },

    hideData({ commit }) {
        commit('setShow', false);
    }
}
