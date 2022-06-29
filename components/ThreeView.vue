<template>
  <v-container ref="container" fluid fill-height class="pa-0 ma-0">
    <div @mousemove="onMouseMove" @dblclick="onMouseDown" ref="canvas" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Three from "./three.js";

export default {
  name: "ThreeView",
  data: function () {
    return {
      three: new Three(),
    };
  },
  computed: mapState("scene", ["mode", "attributeMode"]),
  mounted: function () {
    window.three = this.three;
    this.three.setup(this.$refs);
    this.three.start();
  },

  methods: {
    ...mapActions("scene", ["select"]),
    ...mapActions("property", ["showProperties"]),
    onMouseMove(event) {
      this.three.pointer.x = (event.offsetX / event.target.width) * 2 - 1;
      this.three.pointer.y = -(event.offsetY / event.target.height) * 2 + 1;
    },
    async onMouseDown() {
      this.three.raycaster.setFromCamera(this.three.pointer, this.three.camera);
      if (this.mode === "Scene") {
        let intersects = this.three.raycaster.intersectObjects(
          this.three.interactiveGroup.children
        );
        intersects = intersects.filter(
          (intersect) => intersect.object.type === "Mesh"
        );
        if (intersects.length > 0) {
          console.log("raytrace intersects", intersects);
          let obj = intersects[0].object;
          if (obj.isAttributes) obj = obj.parent;
          await this.select(obj.id);
          this.$root.$emit("highlight");
        } else {
          this.select();
        }
      } else if (this.mode === "Attributes") {
        this.three.editingObj.children.forEach((attributeObject) => {
          if (!attributeObject.isAttributes) return;
          if (attributeObject.name === this.attributeMode) {
            this.three.raycaster.params.Points.threshold =
              this.three.raycaster.params.Line.threshold =
                this.three.editingObj.raycastThreshold;
            let intersects =
              this.three.raycaster.intersectObject(attributeObject);
            if (intersects.length) {
              // intersects.forEach((intersect) => {
              //   const geometry = new THREE.SphereGeometry(0.01);
              //   const material = new THREE.MeshBasicMaterial({
              //     color: 0xffff00,
              //   });
              //   const sphere = new THREE.Mesh(geometry, material);
              //   sphere.position.copy(intersect.point);
              //   this.three.editingObj.add(sphere);
              // });

              let index =
                intersects[0].index !== undefined
                  ? intersects[0].index
                  : intersects[0].faceIndex;
              let attributeProperties = attributeObject.selectAttribute(index);

              this.showProperties({
                id: null,
                properties: attributeProperties || [],
              });
            }
          } else {
            attributeObject.selectAttribute(-1);
          }
        });
      }
    },
  },
};
</script>
