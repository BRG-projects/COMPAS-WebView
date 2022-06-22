<template>
  <v-container class="pa-5">
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

    <v-row>
      <v-col>
        Views
        <v-btn block class="my-1" @click="setView('top')">Top</v-btn>
        <v-btn block class="my-1" @click="setView('bottom')">Bottom</v-btn>
        <v-btn block class="my-1" @click="setView('front')">Front</v-btn>
        <v-btn block class="my-1" @click="setView('back')">Back</v-btn>
        <v-btn block class="my-1" @click="setView('left')">Left</v-btn>
        <v-btn block class="my-1" @click="setView('right')">Right</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Vector3, Box3 } from "three";

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
      this.position.x = Number(this.position.x.toFixed(3));
      this.position.y = Number(this.position.y.toFixed(3));
      this.position.z = Number(this.position.z.toFixed(3));
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
      this.target.x = Number(this.target.x.toFixed(3));
      this.target.y = Number(this.target.y.toFixed(3));
      this.target.z = Number(this.target.z.toFixed(3));
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

    setView(view) {
      console.log(view);
      const box = new Box3();
      box.setFromObject(three.objectsGroup);
      box.getCenter(this.target);
      const size = new Vector3();
      if (three.objectsGroup.children.length > 0) {
        box.getSize(size);
      } else {
        size.set(2, 2, 2);
      }
      switch (view) {
        case "top":
          this.position.set(
            this.target.x,
            this.target.y,
            this.target.z + size.z * 5 
          );
          break;
        case "bottom":
          this.position.set(
            this.target.x,
            this.target.y,
            this.target.z - size.z * 5 
          );
          break;
        case "front":
          this.position.set(
            this.target.x,
            this.target.y + size.y * 1,
            this.target.z
          );
          break;
        case "back":
          this.position.set(
            this.target.x,
            this.target.y - size.y * 1,
            this.target.z
          );
          break;
        case "left":
          this.position.set(
            this.target.x - size.x * 1,
            this.target.y,
            this.target.z
          );
          break;
        case "right":
          this.position.set(
            this.target.x + size.x * 1,
            this.target.y,
            this.target.z
          );
          break;
      }

      this.setTarget();
    },
  },
};
</script>
