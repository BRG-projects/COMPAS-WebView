<template>
  <v-container class="pa-5">
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
      three.scene.background.setHex(val);
    },

    viewMode(val) {
      let initViewProperties = (obj) => {
        if (obj.material) {
          if (obj.material._opacity === undefined) {
            obj.material._opacity = obj.material.opacity;
          }
          if (obj.material._transparent === undefined) {
            obj.material._transparent = obj.material.transparent;
          }
        }
      };
      three.objectsGroup.traverse((child) => {
        if (!child.isAttributes || !child.material) return;
        initViewProperties(child);
        if (val === "Normal") {
          if (child.name === "faces") child.visible = true;
          if (child.name === "edges") child.visible = false;
          if (child.name === "vertices") child.visible = false;
          child.material.transparent = child.material._transparent;
          child.material.opacity = child.material._opacity;
        } else if (val === "Ghosted") {
          if (child.name === "faces") child.visible = true;
          if (child.name === "edges") child.visible = false;
          if (child.name === "vertices") child.visible = false;
          child.material.transparent = true;
          child.material.opacity = 0.3;
        } else if (val === "Wireframe") {
          if (child.name === "faces") child.visible = false;
          if (child.name === "edges") child.visible = true;
          if (child.name === "vertices") child.visible = false;
        } else if (val === "NormalWireframe") {
          if (child.name === "faces") child.visible = true;
          if (child.name === "edges") child.visible = true;
          if (child.name === "vertices") child.visible = false;
          child.material.transparent = child.material._transparent;
          child.material.opacity = child.material._opacity;
        } else if (val === "GhostedWireframe") {
          if (child.name === "faces") child.visible = true;
          if (child.name === "edges") child.visible = true;
          if (child.name === "vertices") child.visible = false;
          child.material.transparent = true;
          child.material.opacity = 0.3;
        }
      });
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
