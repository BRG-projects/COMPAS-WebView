<template>
  <v-navigation-drawer :value="showController" right app fixed width="400">
    <v-list>
      <v-list-group v-model="showSource">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>File</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item>
          <v-list-item-content>
            <v-radio-group v-model="fileSource">
              <v-radio value="Repo" label="Repo"></v-radio>
              <v-radio value="Local" label="Local"></v-radio>
              <v-radio value="URL" label="URL"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="fileSource === 'Repo'">
          <v-list-item-content>
            <v-text-field label="Repo Adress"></v-text-field>
            <v-select
              label="Version"
              :items="['0.0.1', '0.5.0', '1.0.0']"
            ></v-select>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="fileSource === 'Local'">
          <v-list-item-content>
            <v-file-input
              truncate-length="15"
              label="Local File"
            ></v-file-input>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="fileSource === 'URL'">
          <v-list-item-content>
            <v-text-field label="URL" v-model="fileURL"></v-text-field>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-btn>Load</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group v-model="showScene" @click="refresh">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Scene</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-if="scene">
          <v-list-item-content>
            <v-treeview
              :items="scene"
              v-model="sceneSelection"
              selection-type="independent"
              selectable
              hoverable
              selected-color="green"
            ></v-treeview>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Controller",
  computed: {
    ...mapState(["showController"]),
  },
  data() {
    return {
      showSource: true,
      fileSource: "Repo",
      showScene: false,
      scene: null,
      sceneSelection: [],
    };
  },
  methods: {
    refresh() {
      if (window.scene) {
        let id = 0;
        let getChildren = (parent) => {
          return parent.children.map((child) => {
            this.sceneSelection.push(child.id);
            return {
              name: `<${child.constructor.name}>${child.name}`,
              id: child.id,
              children: getChildren(child),
            };
          });
        };
        this.scene = getChildren(window.scene);
        console.log(this.scene);
      }
    },
  },
  watch: {
    sceneSelection() {
      console.log(this.sceneSelection);
      window.scene.traverse((child) => {
        if (child == window.scene) return;
        if (this.sceneSelection.includes(child.id)) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      });
    },
  },
};
</script>
