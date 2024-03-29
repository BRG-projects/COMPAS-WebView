<template>
  <v-container class="pa-5">
    <v-row>
      <v-col>
        <v-radio-group v-model="backgroundColor" label="Theme">
          <v-radio label="Dark" :value="0x1e1e1e" />
          <v-radio label="Light" :value="0xeeeeee" />
        </v-radio-group>
      </v-col>
      <v-col>
        <v-radio-group v-model="upAxis" label="Up Axis">
          <v-radio label="Y" value="Y" />
          <v-radio label="Z" value="Z" />
        </v-radio-group>
      </v-col>
      <v-col>
        <v-radio-group v-model="viewMode" label="View Mode">
          <v-radio label="Normal" value="Normal" />
          <v-radio label="Ghosted" value="Ghosted" />
          <v-radio label="Wireframe" value="Wireframe" />
          <v-radio label="Normal+Wireframe" value="NormalWireframe" />
          <v-radio label="Ghosted+Wireframe" value="GhostedWireframe" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-switch label="Grid" v-model="grid" />
        <v-switch label="Gimbal" v-model="gimbal" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as THREE from "three";
import { mapActions } from "vuex";

export default {
  name: "Environment",

  data() {
    return {
      useHdri: false,
      upAxis: "Z",
      viewMode: "Normal",
      backgroundColor: 0xeeeeee,
      activated: [],
      gimbal: false,
      grid: true,
    };
  },

  watch: {
    upAxis(val) {
      if (val === "Y") {
        three.camera.up.set(0, 1, 0);
        three.controls.updateCameraUp();
      } else {
        three.camera.up.set(0, 0, 1);
        three.controls.updateCameraUp();
      }
    },

    backgroundColor(val) {
      const dark = val === 0x1e1e1e;
      three.scene.background.setHex(val);
      this.$vuetify.theme.dark = dark;
      three.adaptAttributesColorToTheme(dark);
    },

    viewMode(val) {
      this.enableGhostedView(val === "Ghosted" || val === "GhostedWireframe");
      const attributesVisibilities = {
        Normal: ["faces"],
        Ghosted: ["faces"],
        Wireframe: ["edges"],
        NormalWireframe: ["edges", "faces"],
        GhostedWireframe: ["edges", "faces"],
      };
      this.showAttributes(attributesVisibilities[val]);
    },

    gimbal(val) {
      if (val) {
        three.enableTransformControls = true;
        if (three.selected) {
          three.attachGimbal(three.selected);
        }
      } else {
        three.enableTransformControls = false;
        three.transformControls.detach();
      }
    },

    grid(val) {
      if (val) {
        three.grid.visible = three.axes.visible = true;
      } else {
        three.grid.visible = three.axes.visible = false;
      }
    },
  },

  methods: {
    ...mapActions("scene", ["showAttributes", "enableGhostedView"]),
    showHdri() {
      if (this.useHdri) {
        three.scene.background = three.hdri;
        three.scene.environment = three.hdri;
      } else {
        three.scene.background = new THREE.Color(0x1e1e1e);
        three.scene.environment = null;
      }
    },
  },
};
</script>
