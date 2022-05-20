<template>
  <v-container ref="container" fluid fill-height class="pa-0 ma-0">
    <div ref="canvas" />
  </v-container>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import CameraControls from "camera-controls";

CameraControls.install({ THREE });

class Three {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.controls = null;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.light = new THREE.DirectionalLight("hsl(0, 100%, 100%)");
    this.axes = new THREE.AxesHelper(5);
    this.clock = new THREE.Clock();
    this.group = new THREE.Group();
    this.gltfGroup = new THREE.Group();
    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();
    this.mixer = null;
    this.hdri = null;
    this.selected = null;
  }

  setup(refs) {
    this.refs = refs;
    this.group.name = "Default";
    this.light.position.set(0, 0, 10);
    this.camera.position.z = 5;
    this.group.add(this.camera);
    this.group.add(this.light);
    this.group.add(this.axes);
    this.scene.add(this.group);

    this.gltfGroup.name = "GLTFs";
    this.scene.add(this.gltfGroup);

    this.scene.background = new THREE.Color(0x1e1e1e);
    this.refs.canvas.appendChild(this.renderer.domElement);
    this.controls = new CameraControls(this.camera, this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.composer.addPass(this.outlinePass);

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

    let hdri;
    if (window.location.host.includes("localhost"))
      hdri = "/studio_small_08_4k.hdr";
    else hdri = "/GLTF_viewer/studio_small_08_4k.hdr";
    new RGBELoader().load(hdri, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      this.hdri = texture;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onMouseMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMouseDown(event) {
      raycaster.setFromCamera(pointer, window.three.camera);
      const intersects = raycaster.intersectObjects(
        window.three.gltfGroup.children
      );
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        window.three.select(obj);
      } else {
        window.three.select();
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("dblclick", onMouseDown);
  }

  select(obj) {
    console.log("select", obj);
    if (obj) {
      this.selected = obj;
      this.outlinePass.selectedObjects = [obj];
    } else {
      this.selected = null;
      this.outlinePass.selectedObjects = [];
    }
  }

  start() {
    let animate = () => {
      const delta = this.clock.getDelta();
      this.controls.update(delta);

      requestAnimationFrame(animate);
      // this.renderer.render(this.scene, this.camera);
      this.composer.render();
      if (this.mixer) {
        this.mixer.update(delta);
      }
    };

    animate();
  }

  updateDimensions() {
    let width = window.three.refs.container.clientWidth;
    let height = window.three.refs.container.clientHeight;
    window.three.renderer.setSize(width, height);
    window.three.composer.setSize(width, height);
    window.three.camera.aspect = width / height;
    window.three.camera.updateProjectionMatrix();
  }
}

export default {
  name: "ThreeView",
  data: function () {
    return {
      three: new Three(),
    };
  },
  mounted: function () {
    window.three = this.three;
    this.three.setup(this.$refs);
    this.three.start();
  },
};
</script>
