<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <v-switch label="HDRI" v-model="useHdri" @change="showHdri"></v-switch>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-treeview :items="tree" hoverable selected-color="green">
          <template v-slot:prepend="{ item }">
            <v-icon v-if="getObject(item.id).visible" @click="show(item)">
              mdi-eye
            </v-icon>
            <v-icon v-if="!getObject(item.id).visible" @click="show(item)">
              mdi-eye-off
            </v-icon>
            <v-icon @click="remove(item)"> mdi-delete </v-icon>
          </template></v-treeview
        >
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as THREE from "three";


export default {
  name: "Scene",
  computed: {
    ...mapState("scene", ["tree"]),
  },

  data() {
    return {
      useHdri: false,
    };
  },

  methods: {
    ...mapActions("scene", ["refreshTree"]),

    show(item) {
      let obj = this.getObject(item.id);
      obj.visible = !obj.visible;
    },

    remove(item) {
      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        let obj = this.getObject(item.id);
        obj.parent.remove(obj);
        this.refreshTree(window.scene);
      }
    },

    getObject(id) {
      let obj;
      window.scene.traverse((child) => {
        if (child.id == id) {
          obj = child;
        }
      });

      return obj;
    },

    showHdri(){
      if (this.useHdri) {
        window.scene.background = window.hdri;
      } else {
        window.scene.background = new THREE.Color(0xffffff);
      }
    }
  },
};
</script>
