<template>
  <v-navigation-drawer :value="showController" right app fixed width="500">
    <v-tabs v-model="tab">
      <v-tab key="File"><v-icon>mdi-folder</v-icon></v-tab>
      <v-tab key="Scene"><v-icon>mdi-file-tree</v-icon></v-tab>
      <v-tab key="Camera"><v-icon>mdi-camera</v-icon></v-tab>
      <v-tab key="Environment"><v-icon>mdi-earth</v-icon></v-tab>
      <v-tab key="Animation"><v-icon>mdi-motion-play</v-icon></v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="full-height-tab">
      <v-tab-item key="File">
        <File />
      </v-tab-item>
      <v-tab-item key="Scene">
        <Scene />
      </v-tab-item>
      <v-tab-item key="Camera">
        <Camera />
      </v-tab-item>
      <v-tab-item key="Environment">
        <Environment />
      </v-tab-item>
      <v-tab-item key="Animation">
        <Animation />
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import File from "./File.vue";
import Scene from "./Scene.vue";
import Environment from "./Environment.vue";
import Animation from "./Animation.vue";
import Camera from "./Camera.vue";

export default {
  name: "Controller",
  components: {
    File,
    Scene,
    Animation,
    Environment,
    Camera,
  },
  computed: {
    ...mapState(["showController"]),
  },
  data() {
    return {
      tab: null,
    };
  },
  methods: {},
};
</script>
<style >
.v-tabs-items.full-height-tab .v-window-item {
  height: calc(100vh - 48px); /* Adjust 270px to suits your needs */
  overflow-y: auto;
}
</style>