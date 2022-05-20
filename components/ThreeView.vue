<template>
  <v-container ref="container" fluid fill-height class="pa-0 ma-0">
    <div ref="canvas" />
  </v-container>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { mapMutations } from "vuex";
import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

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
    // camera.up.set(0, 0, 1);
    return {
      scene: scene,
      camera: camera,
      controls: [],
      renderer: renderer,
      light: light,
      axes: axes,
      clock: new THREE.Clock(),
      group: new THREE.Group(),
      speed: 0.01,
    };
  },
  created: function () {
    this.group.name = "Default";
    this.group.add(this.camera);
    this.group.add(this.light);
    this.group.add(this.axes);
    this.scene.add(this.group);
    this.light.position.set(0, 0, 10);
    this.camera.position.z = 5;
    this.scene.background = new THREE.Color("hsl(0, 100%, 100%)");
  },
  mounted: function () {
    this.$refs.canvas.appendChild(this.renderer.domElement);
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    this.clock = new THREE.Clock();

    window.loader = new GLTFLoader();

    let hdri;
    if (window.location.host.includes("localhost"))
      hdri = "/studio_small_08_4k.hdr";
    else hdri = "/GLTF_viewer/studio_small_08_4k.hdr";
    new RGBELoader().load(hdri, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      window.hdri = texture;
    });

    window.scene = this.scene;
    window.camera = this.camera;
    window.controls = this.controls;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onMouseMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMouseDown(event){
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(window.scene.children);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        console.log(obj)
      }
    }

    window.addEventListener( 'mousemove', onMouseMove );
    window.addEventListener( 'mousedown', onMouseDown );

    this.animate();
  },

  methods: {
    animate: function () {
      const delta = this.clock.getDelta();
      this.controls.update(delta);

      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      // this.controls.update();
      if (window.mixer) {
        window.mixer.update(this.clock.getDelta());
      }
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
