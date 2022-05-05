<template>
  <v-container ref="container" fluid fill-height class="pa-0 ma-0">
    <div ref="canvas" />
  </v-container>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { mapMutations } from "vuex";

export default {
  name: "ThreeView",
  data: function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      width: 500,
      height: window.innerHeight,
    });
    const light = new THREE.DirectionalLight("hsl(0, 100%, 100%)");
    const axes = new THREE.AxesHelper(5);

    return {
      scene: scene,
      camera: camera,
      controls: [],
      renderer: renderer,
      light: light,
      axes: axes,
      speed: 0.01,
    };
  },
  created: function () {
    this.scene.add(this.camera);
    this.scene.add(this.light);
    this.scene.add(this.axes);
    this.light.position.set(0, 0, 10);
    this.camera.position.z = 5;
    this.scene.background = new THREE.Color("hsl(0, 100%, 100%)");
  },
  mounted: function () {
    this.$refs.canvas.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    const loader = new GLTFLoader().setPath("/");
    loader.load("DamagedHelmet.gltf", (gltf) => {
      this.scene.add(gltf.scene);
    });

    new RGBELoader().setPath("/").load("studio_small_08_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;
      this.scene.environment = texture;
    });

    window.scene = this.scene;

    this.animate();
  },

  methods: {
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    },

    updateDimensions() {
      let width = this.$refs.container.clientWidth;
      let height = this.$refs.container.clientHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },

    ...mapMutations(["setScene"]),
  },
};
</script>
