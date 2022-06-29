import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import CameraControls from "camera-controls";


CameraControls.install({ THREE });

export default class Three {
    constructor() {
        this.scene = new THREE.Scene();
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.perspectiveCamera.position.set(10, 10, 10);
        this.perspectiveCamera.up.set(0, 0, 1);
        this.orthographicCamera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            0.1,
            1000
        );
        this.orthographicCamera.position.set(10, 10, 10);
        this.orthographicCamera.up.set(0, 0, 1);
        this.camera = this.perspectiveCamera;
        this.controls = null;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.pointLight = new THREE.PointLight(0xffffff, 0.5, 50);
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.axes = new THREE.AxesHelper(5);
        this.grid = new THREE.GridHelper(10, 10);
        this.clock = new THREE.Clock();
        this.defaultGroup = new THREE.Group();
        this.interactiveGroup = new THREE.Group();
        this.objectsGroup = new THREE.Group();
        this.loader = new GLTFLoader();
        this.clock = new THREE.Clock();
        this.mixer = null;
        this.hdri = null;
        this.selected = null;
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.enableTransformControls = false;
        this.editingObj = null;
    }

    setup(refs) {
        this.refs = refs;
        this.defaultGroup.name = "Default";
        this.camera.add(this.pointLight);
        this.pointLight.position.set(5, 5, 5);
        this.defaultGroup.add(this.ambientLight);
        this.defaultGroup.add(this.perspectiveCamera);
        this.defaultGroup.add(this.orthographicCamera);

        this.axes.geometry.attributes.position.count = 4;
        this.axes.material.depthTest = false;
        this.grid.material.depthTest = false;
        this.axes.renderOrder = -1;
        this.grid.renderOrder = -2;
        this.grid.rotateX(-Math.PI / 2);
        this.defaultGroup.add(this.grid);

        this.defaultGroup.add(this.axes);
        this.scene.add(this.defaultGroup);
        this.interactiveGroup.add(this.objectsGroup);
        this.scene.add(this.interactiveGroup);

        this.scene.background = new THREE.Color(0xeeeeee);
        this.refs.canvas.appendChild(this.renderer.domElement);
        this.controls = new CameraControls(this.camera, this.renderer.domElement);
        this.transformControls = new TransformControls(
            this.camera,
            this.renderer.domElement
        );
        this.transformControls.name = "Gimbal";
        this.scene.add(this.transformControls);

        this.transformControls.addEventListener("dragging-changed", (event) => {
            this.controls.enabled = !event.value;
        });

        this.composer = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.interactiveGroup,
            this.camera
        );
        this.outlinePass.edgeThickness = 2;
        this.outlinePass.edgeStrength = 10;
        this.composer.addPass(this.outlinePass);

        this.effectFXAA = new ShaderPass(FXAAShader);
        this.effectFXAA.uniforms["resolution"].value.set(
            1 / window.innerWidth,
            1 / window.innerHeight
        );
        this.composer.addPass(this.effectFXAA);

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);

        // let hdri;
        // if (window.location.host.includes("localhost"))
        //   hdri = "/studio_small_08_4k.hdr";
        // else hdri = "/COMPAS-WebView/studio_small_08_4k.hdr";
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
            this.attachGimbal(obj);
        } else {
            this.selected = null;
            this.outlinePass.selectedObjects = [];
            this.transformControls.detach();
        }
    }

    attachGimbal(obj) {
        if (this.enableTransformControls) {
            this.transformControls.attach(obj);
            const bbox = new THREE.Box3().setFromObject(obj);
            bbox.getCenter(this.transformControls.position);
            this.transformControls.position.sub(obj.position);
        }
    }

    focus(obj) {
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
        let width = three.refs.container.clientWidth;
        let height = three.refs.container.clientHeight;
        three.renderer.setSize(width, height);
        three.composer.setSize(width, height);
        three.effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
        if (three.camera === three.perspectiveCamera) {
            three.camera.aspect = width / height;
        } else if (three.camera === three.orthographicCamera) {
            three.camera.left = -width / 2;
            three.camera.right = width / 2;
            three.camera.top = height / 2;
            three.camera.bottom = -height / 2;
        }
        three.camera.updateProjectionMatrix();
    }

    editAttributes(obj) {
        this.select(null);
        this.objectsGroup.children.forEach((child) => {
            child._visible = child.visible;
            child.visible = false;
        });
        console.log("Editing attributes:", obj);
        obj.visible = true;
        this.editingObj = obj;
        obj.children.forEach((child) => (child.visible = true));
        this.mode = "Attributes";
        this.focus(obj);
    }

    exitEditAttributes() {
        this.objectsGroup.children.forEach((child) => {
            child.visible = child._visible;
        });
        this.editingObj.children.forEach((child) => {
            child.selectAttribute(null);
        });
        this.editingObj = null;
        this.mode = "Scene";
    }

    adaptAttributesColorToTheme(isDark) {
        this.objectsGroup.traverse((obj) => {
            if (
                obj.isAttributes &&
                (obj.name === "edges" || obj.name === "vertices")
            ) {
                obj.invertColor(isDark);
            }
        });
    }

    getObjectById(id) {
        let obj;
        this.objectsGroup.traverse((_obj) => {
            if (_obj.id === id) {
                obj = _obj;
            }
        });
        return obj;
    }
}