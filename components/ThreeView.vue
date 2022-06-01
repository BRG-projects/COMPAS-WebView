<template>
  <v-container ref="container" fluid fill-height class="pa-0 ma-0">
    <div @mousemove="onMouseMove" @dblclick="onMouseDown" ref="canvas" />
  </v-container>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
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
    this.pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.axes = new THREE.AxesHelper(5);
    this.grid = new THREE.GridHelper(10, 10);
    this.clock = new THREE.Clock();
    this.group = new THREE.Group();
    this.gltfGroup = new THREE.Group();
    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();
    this.mixer = null;
    this.hdri = null;
    this.selected = null;
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });
  }

  setup(refs) {
    this.refs = refs;
    this.group.name = "Default";
    this.camera.position.set(5, 5, 5);
    this.camera.up.set(0, 0, 1);
    this.camera.add(this.pointLight);
    this.group.add(this.ambientLight);
    this.group.add(this.camera);

    this.axes.geometry.attributes.position.count = 4;
    this.axes.material.depthTest = false;
    this.grid.material.depthTest = false;
    this.axes.renderOrder = -1;
    this.grid.renderOrder = -2;
    this.grid.rotateX(-Math.PI / 2);
    this.group.add(this.grid);

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

    let effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this.composer.addPass(effectFXAA);

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

    // let hdri;
    // if (window.location.host.includes("localhost"))
    //   hdri = "/studio_small_08_4k.hdr";
    // else hdri = "/GLTF_viewer/studio_small_08_4k.hdr";
    // new RGBELoader().load(hdri, (texture) => {
    //   texture.mapping = THREE.EquirectangularReflectionMapping;
    //   this.hdri = texture;
    // });
  }

  select(obj) {
    console.log("select", obj);
    if (obj) {
      this.selected = obj;
      obj.selected = true;
      this.outlinePass.selectedObjects = [obj];
    } else {
      this.selected = null;
      this.outlinePass.selectedObjects = [];
    }
  }

  focus(obj){
    this.controls.fitToSphere(obj, true);
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

  methods: {
    onMouseMove(event) {
      this.three.pointer.x = (event.offsetX / event.target.width) * 2 - 1;
      this.three.pointer.y = -(event.offsetY / event.target.height) * 2 + 1;
    },
    onMouseDown() {
      this.three.raycaster.setFromCamera(this.three.pointer, this.three.camera);
      let intersects = this.three.raycaster.intersectObjects(
        this.three.gltfGroup.children
      );
      intersects = intersects.filter(
        (intersect) => intersect.object.type === "Mesh"
      );
      if (intersects.length > 0) {
        console.log("raytrace intersects", intersects);
        const obj = intersects[0].object;
        this.three.select(obj);
      } else {
        this.three.select();
      }
    },
  },
};
</script>
