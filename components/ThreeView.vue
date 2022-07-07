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
    ...mapActions("scene", [
      "select",
      "getActiveAttributeObj",
      "getEditingObj",
    ]),
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
          let id = obj.id;
          await this.select({ id });
        } else {
          this.select({});
        }
      } else if (this.mode === "Attributes") {
        let editingObj = await this.getEditingObj();
        this.three.raycaster.params.Points.threshold =
          this.three.raycaster.params.Line.threshold =
            editingObj.raycastThreshold;
        let attributeObj = await this.getActiveAttributeObj();
        console.log(attributeObj)
        let intersects = this.three.raycaster.intersectObject(attributeObj);
        if (intersects.length) {
          let index =
            intersects[0].index !== undefined
              ? intersects[0].index
              : intersects[0].faceIndex;
            
          console.log("sdafasfsafd")

          let attributeKey = attributeObj.indexToKey(index);
          this.select({ attributeKey });
        } else {
          this.select({});
        }
      }
    },
  },
};
</script>
