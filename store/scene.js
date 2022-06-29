export const state = () => {
    return {
        mode: "Scene",
        tree: [],
        selected: null,
        attributesVisibility: {
            vertices: false,
            edges: false,
            faces: true,
        }
    }
}

export const mutations = {

    setTree(state, tree) {
        state.tree = tree
    },

    setSelected(state, id) {
        state.selected = id
    },

    setVisibility(state, { id, visible }) {
        let item = getTreeItem(state.tree, id);
        item.visible = visible;
    },

    setAttributesVisibility(state, attributesVisibility) {
        state.attributesVisibility = attributesVisibility;
    }

}

export const actions = {

    async select({ commit, dispatch }, id) {
        commit('setSelected', id);
        let obj = await dispatch("getObject", id);
        three.select(obj);
        let properties = [];
        if (obj) {
            properties = [
                {
                    key: "name",
                    value: obj.name,
                },
                {
                    key: "type",
                    value: obj.type,
                },
            ];
            if (obj.guid) {
                properties.push({
                    key: "guid",
                    value: obj.guid,
                });
            }
            if (obj.settings) {
                properties.push({
                    key: "settings",
                    value: "{...}",
                });
            }
            if (obj.data) {
                properties.push({
                    key: "data",
                    value: "{...}",
                    data: obj.data,
                });
            }
        }

        await dispatch('property/showProperties', { id, properties }, { root: true })

    },

    updateTree({ commit }) {
        if (!three) return;
        let getChildren = (parent) => {
            return parent.children
                .filter((child) => child.name !== "Gimbal")
                .map((child) => {
                    let children = [];
                    if (three.mode === "Scene") children = getChildren(child);
                    else if (three.mode === "Attributes" && child.getAttributes)
                        children = child.getAttributes(child);
                    return {
                        name:
                            child.name || child.guid
                                ? child.name || child.guid
                                : `(${child.type})`,
                        id: child.id,
                        guid: child.guid,
                        type: child.type,
                        visible: child.visible,
                        children: children,
                    };
                });
        };

        if (three.mode === "Scene") commit("setTree", getChildren(three.objectsGroup));
        else if (three.mode === "Attributes") commit("setTree", getChildren(three.editingObj));
    },

    async toggleVisibility({ commit, dispatch }, id) {
        if (!three) return;
        let obj = await dispatch("getObject", id);
        if (obj) {
            obj.visible = !obj.visible;
            commit("setVisibility", { id, visible: obj.visible });
        }
    },

    async toggleAttributesVisibility({ state, commit, dispatch }, name) {
        let attributesVisibility = { ...state.attributesVisibility };
        let visible = attributesVisibility[name] = !attributesVisibility[name];
        commit("setAttributesVisibility", attributesVisibility);

        if (!three) return;
        three.objectsGroup.traverse((obj) => {
            if (obj.isAttributes && obj.name === name) {
                obj.visible = visible;
            }
        });
        await dispatch("updateTree");
    },

    async showAttributes({ state, commit, dispatch }, names = []) {
        let attributesVisibility = { ...state.attributesVisibility };
        for (let key in attributesVisibility) {
            attributesVisibility[key] = names.includes(key);
        }
        commit("setAttributesVisibility", attributesVisibility);

        if (!three) return;
        three.objectsGroup.traverse((obj) => {
            if (obj.isAttributes) {
                obj.visible = attributesVisibility[obj.name];
            }
        });
        await dispatch("updateTree");
    },

    async removeObject({ dispatch }, id) {
        let obj = await dispatch("getObject", id);
        obj.parent.remove(obj);
        await dispatch("updateTree");
    },

    getObject(_, id) {
        if (!three) return;
        let obj = null;
        three.scene.traverse((child) => {
            if (child.id == id) {
                obj = child;
            }
        });
        return obj;
    },

    async enableGhostedView(_, ghosted) {
        if (!three) return;
        three.objectsGroup.traverse((obj) => {
            if (!obj.isAttributes) return;
            if (obj.material._opacity === undefined) {
                obj.material._opacity = obj.material.opacity;
            }
            if (obj.material._transparent === undefined) {
                obj.material._transparent = obj.material.transparent;
            }
            if (ghosted) {
                obj.material.transparent = true;
                obj.material.opacity = 0.3;
            } else {
                obj.material.transparent = obj.material._transparent;
                obj.material.opacity = obj.material._opacity;
            }
        });
    }

}

function getTreeItem(tree, id) {
    let found = {};
    let findItem = (parent, id, found) => {
        if (parent.id == id) {
            found.item = parent;
        } else if (parent.children) {
            parent.children.forEach((child) => {
                findItem(child, id, found);
            });
        }
    };

    findItem({ children: tree }, id, found);

    return found.item;
}