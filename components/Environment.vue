<template>
  <v-container>
    <v-row>
      <v-col>
        <v-radio-group v-model="backgroundColor" label="Background">
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
        </v-radio-group>
      </v-col>
      <v-col>
        <v-radio-group v-model="gimbal" label="Gimbal">
          <v-radio label="On" :value="true" />
          <v-radio label="Off" :value="false" />
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as THREE from "three";

export default {
  name: "Environment",

  data() {
    return {
      useHdri: false,
      upAxis: "Z",
      viewMode: "Normal",
      backgroundColor: 0x1e1e1e,
      activated: [],
      gimbal: false,
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
      three.scene.background.setHex(val);
    },

    viewMode(val) {
      if (val === "Normal") {
        three.edgeMaterial.depthTest = true;
      } else if (val === "Ghosted") {
        three.edgeMaterial.depthTest = false;
      }
    },

    gimbal(val) {
      if (val) {
        three.enableTransformControls = true;
        if (three.selected) {
          three.transformControls.attach(three.selected);
        }
      } else {
        three.enableTransformControls = false;
        three.transformControls.detach();
      }
    },
  },

  methods: {
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
