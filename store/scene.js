export const state = () => {
    return {
        mode: "Scene",
        attributeMode: "vertices",
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

    setMode(state, mode) {
        state.mode = mode;
    },

    setAttributeMode(state, mode) {
        state.attributeMode = mode;
    },

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

    async select({ commit, dispatch, state }, { id, attributeKey }) {

        if (state.mode === "Scene") {
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
        } else {

            if (typeof id === "string") {
                // When called from tree
                let attributeMode = id.split(".")[0];
                if (["vertices", "edges", "faces"].includes(attributeMode)) {
                    commit('setAttributeMode', attributeMode);
                    commit('setSelected', id);
                    attributeKey = id.split(".")[1];
                }
            } else {
                // When called from raytracing
                commit('setSelected', state.attributeMode + "." + attributeKey);
            }
            if (attributeKey) {
                let attributeObj = await dispatch("getAttributeObject");
                attributeObj.selectAttribute(attributeKey);
                let properties = attributeObj.getAttributeProperties(attributeKey);
                await dispatch('property/showProperties', { properties }, { root: true })
            }

        }

    },

    updateTree({ commit, state }) {
        if (!three) return;
        let getChildren = (parent) => {
            return parent.children
                .map((child) => {
                    let children = [];
                    if (state.mode === "Scene") children = getChildren(child);
                    else if (state.mode === "Attributes" && child.getAttributes)
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

        if (state.mode === "Scene") commit("setTree", getChildren(three.objectsGroup));
        else if (state.mode === "Attributes") commit("setTree", getChildren(three.editingObj));
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

    getAttributeObject({ state }) {
        let attributeObj = null;
        three.editingObj.traverse((child) => {
            if (child.isAttributes && child.name === state.attributeMode) {
                attributeObj = child;
            }
        });
        return attributeObj;
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
    },

    async startEditAttributes({ dispatch, commit }, id) {
        commit("setMode", "Attributes");
        let obj = await dispatch("getObject", id);
        three.focus(obj);
        three.select(null);
        three.objectsGroup.traverse((child) => {
            if (child === three.objectsGroup) return;
            child._visible = child.visible;
            child.visible = child === obj;
        });
        console.log("Editing attributes:", obj);
        three.editingObj = obj;


        await dispatch("updateTree");
        await dispatch("showAttributes", ["vertices", "edges", "faces"]);
    },

    async exitEditAttributes({ dispatch, commit }) {
        commit("setMode", "Scene");

        three.objectsGroup.traverse((child) => {
            child.visible = child._visible;
        })
        three.editingObj.traverse((child) => {
            if (child.selectAttribute)
                child.selectAttribute(null);
        });
        three.editingObj = null;
        three.select(null);
        await dispatch("updateTree");
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