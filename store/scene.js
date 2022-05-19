export const state = () => {
    return {
        tree: [],
    }
}

export const mutations = {

    setTree(state, tree) {
        state.tree = tree
    }
}

export const actions = {
    refreshTree({ commit }, scene) {

        // this.sceneSelection = [];
        let getChildren = (parent) => {
            return parent.children.map((child) => {
                // this.sceneSelection.push(child.id);
                return {
                    name: `<${child.constructor.name}>${child.name}`,
                    id: child.id,
                    children: getChildren(child),
                };
            });
        };

        let tree = getChildren(scene);

        commit('setTree', tree);
    }
}