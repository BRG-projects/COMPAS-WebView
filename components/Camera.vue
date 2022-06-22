<template>
  <v-container class="pa-5">
    <v-row>
      <v-col>
        Position
        <v-row>
          <v-col>
            <v-text-field
              type="number"
              prefix="x"
              outlined
              v-model="position.x"
              @change="setPosition"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              prefix="y"
              outlined
              v-model="position.y"
              @change="setPosition"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              prefix="z"
              outlined
              v-model="position.z"
              @change="setPosition"
            ></v-text-field>
          </v-col>
        </v-row>

        Target
        <v-row>
          <v-col>
            <v-text-field
              type="number"
              prefix="x"
              outlined
              v-model="target.x"
              @change="setTarget"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              prefix="y"
              outlined
              v-model="target.y"
              @change="setTarget"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              prefix="z"
              outlined
              v-model="target.z"
              @change="setTarget"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-slider
          v-model="fov"
          label="FOV"
          max="180"
          min="1"
          thumb-label
        ></v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Vector3 } from "three";

export default {
  name: "Camera",

  data() {
    return {
      fov: null,
      position: new Vector3(),
      target: new Vector3(),
    };
  },

  mounted() {
    this.fov = three.camera.fov;
    this.getPosition();
    three.controls.addEventListener("update", this.getPosition);
    three.controls.addEventListener("update", this.getTarget);
  },

  watch: {
    fov(val) {
      three.camera.fov = val;
      three.camera.updateProjectionMatrix();
    },
  },

  methods: {
    getPosition() {
      three.controls.getPosition(this.position);
    },

    setPosition() {
      three.controls.setPosition(
        Number(this.position.x),
        Number(this.position.y),
        Number(this.position.z)
      );
    },

    getTarget() {
      three.controls.getTarget(this.target);
    },

    setTarget() {
      three.controls.setLookAt(
        Number(this.position.x),
        Number(this.position.y),
        Number(this.position.z),
        Number(this.target.x),
        Number(this.target.y),
        Number(this.target.z)
      );
    },
  },
};
</script>
