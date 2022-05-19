<template>
  <v-navigation-drawer :value="showController" right app fixed width="400">
    <v-list>
      <v-list-group v-model="showSource">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>File</v-list-item-title>
          </v-list-item-content>
        </template>
        <File />
      </v-list-group>
      <v-list-group v-model="showScene">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Scene</v-list-item-title>
          </v-list-item-content>
        </template>
        <Scene />
      </v-list-group>
      <v-list-group v-model="showAnimation">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Animation</v-list-item-title>
          </v-list-item-content>
        </template>
        <Animation />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import File from "./File.vue";
import Scene from "./Scene.vue";
import Animation from "./Animation.vue";

export default {
  name: "Controller",
  components: {
    File,
    Scene,
    Animation,
  },
  computed: {
    ...mapState(["showController"]),
  },
  data() {
    return {
      showSource: true,
      showAnimation: false,
      showScene: false,
      animations: [],
    };
  },
  methods: {},
};
</script>
