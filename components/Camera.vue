<template>
  <v-container class="pa-5">
    <v-radio-group
      :value="cameraType"
      label="Camera Type"
      @change="switchCamera"
    >
      <v-radio label="Perspective" value="Perspective" />
      <v-radio label="Orthographic" value="Orthographic" />
    </v-radio-group>
    <v-slider
      v-if="cameraType === 'Perspective'"
      v-model="fov"
      label="FOV"
      max="180"
      min="1"
      thumb-label
    ></v-slider>
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
    <v-row>
      <v-col>
        Views
        <v-btn block class="my-1" @click="setView('top')">Top</v-btn>
        <v-btn block class="my-1" @click="setView('bottom')">Bottom</v-btn>
        <v-btn block class="my-1" @click="setView('front')">Front</v-btn>
        <v-btn block class="my-1" @click="setView('back')">Back</v-btn>
        <v-btn block class="my-1" @click="setView('left')">Left</v-btn>
        <v-btn block class="my-1" @click="setView('right')">Right</v-btn>
        <v-btn block class="my-1" @click="setView('perspective')">Perspective</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Vector3, Box3 } from "three";
import CameraControls from "camera-controls";

export default {
  name: "Camera",

  data() {
    return {
      cameraType: "Perspective",
      fov: null,
      position: new Vector3(),
      target: new Vector3(),
    };
  },

  mounted() {
    this.fov = three.perspectiveCamera.fov;
    this.trackCamera();
  },

  watch: {
    fov(val) {
      three.perspectiveCamera.fov = val;
      three.perspectiveCamera.updateProjectionMatrix();
    },
  },

  methods: {
    switchCamera(val, lockOrbit) {
      if (val !== this.cameraType) {
        if (val === "Perspective") {
          three.camera = three.perspectiveCamera;
        } else if (val === "Orthographic") {
          three.camera = three.orthographicCamera;
        }
        // three.camera.add(three.pointLight);
        three.renderPass.camera = three.camera;
        three.outlinePass.renderCamera = three.camera;
        three.controls.dispose();
        three.controls = new CameraControls(
          three.camera,
          three.renderer.domElement
        );
        this.trackCamera();
        this.cameraType = val;
      }
      if (three.objectsGroup.children.length)
        three.controls.fitToSphere(three.objectsGroup);
      if (lockOrbit) three.controls.mouseButtons.left = CameraControls.ACTION.NONE;
      else three.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    },

    trackCamera() {
      this.getPosition();
      this.getTarget();
      three.controls.addEventListener("update", this.getPosition);
      three.controls.addEventListener("update", this.getTarget);
    },

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
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x,
            this.target.y,
            this.target.z + size.z
          );
          break;
        case "bottom":
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x,
            this.target.y,
            this.target.z - size.z
          );
          break;
        case "front":
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x,
            this.target.y + size.y,
            this.target.z
          );
          break;
        case "back":
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x,
            this.target.y - size.y,
            this.target.z
          );
          break;
        case "left":
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x - size.x,
            this.target.y,
            this.target.z
          );
          break;
        case "right":
          this.switchCamera("Orthographic", true);
          this.position.set(
            this.target.x + size.x,
            this.target.y,
            this.target.z
          );
          break;
        case "perspective":
          this.switchCamera("Perspective");
          break;
      }

      this.setTarget();
    },
  },
};
</script>
