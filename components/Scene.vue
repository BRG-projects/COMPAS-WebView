<template>
  <v-list>
    <!-- <v-list-item>
      <v-list-item-content>
        <v-switch label="HDRI" v-model="useHdri" @change="showHdri"></v-switch>
      </v-list-item-content>
    </v-list-item> -->

    <v-list-item>
      <v-list-item-content>
        <v-radio-group v-model="backgroundColor" label="Background">
          <v-radio label="Dark" :value="0x1e1e1e" />
          <v-radio label="Light" :value="0xeeeeee" />
        </v-radio-group>
        <v-radio-group v-model="upAxis" label="Up Axis" class="ml-10">
          <v-radio label="Y" value="Y" />
          <v-radio label="Z" value="Z" />
        </v-radio-group>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-card>
          <v-card-title>Scene</v-card-title>
          <v-treeview :items="tree" hoverable activatable :active="activated" @update:active="select">
            <template v-slot:prepend="{ item }">
              <v-icon>
                {{ icons[item.type] }}
              </v-icon>
            </template>
            <template v-slot:label="{ item }">
              <span class="pointer">
                {{ item.name }}
              </span>
            </template>
            <template v-slot:append="{ item }">
              <v-icon v-if="getColor(item)" @click="changeColor(item)">
                mdi-palette
              </v-icon>
              <v-icon @click="show(item)">
                {{ getObject(item.id).visible ? "mdi-eye" : "mdi-eye-off" }}
              </v-icon>
              <v-icon
                v-if="item.name !== 'Default' && item.name !== 'GLTFs'"
                @click="remove(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-treeview>
        </v-card>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="showColorPicker">
      <v-list-item-content>
        <v-row>
          <v-color-picker
            v-model="color"
            dot-size="19"
            swatches-max-height="200"
          ></v-color-picker>
        </v-row>
        <v-row
          ><v-btn @click="confirmColor">Confirm</v-btn
          ><v-btn @click="cancelColor">Cancel</v-btn></v-row
        >
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import * as THREE from "three";

export default {
  name: "Scene",

  computed: {
    tree() {
      if (!window.three) return [];
      let getChildren = (parent) => {
        return parent.children.map((child) => {
          return {
            name: child.name ? child.name : `(${child.type})`,
            id: child.id,
            type: child.type,
            children: getChildren(child),
          };
        });
      };
      return getChildren(window.three.scene);
    },

    selected(){
      if (window.three){
        return window.three.selected
      }else{
        return null;
      }
    }

  },

  data() {
    return {
      useHdri: false,
      upAxis: "Z",
      showColorPicker: false,
      color: null,
      colorObj: null,
      icons: {
        Group: "mdi-folder-multiple",
        Mesh: "mdi-vector-triangle",
        PerspectiveCamera: "mdi-camera",
        PointLight: "mdi-lightbulb",
        AmbientLight: "mdi-lightbulb",
        AxesHelper: "mdi-axis",
        GridHelper: "mdi-axis",
      },
      backgroundColor: 0x1e1e1e,
      activated: [],
    };
  },

  watch: {
    upAxis(val) {
      if (val === "Y") {
        window.three.camera.up.set(0, 1, 0);
        window.three.controls.updateCameraUp();
      } else {
        window.three.camera.up.set(0, 0, 1);
        window.three.controls.updateCameraUp();
      }
    },

    backgroundColor(val) {
      window.three.scene.background.setHex(val);
    },

    selected(selected){
      if (selected)
        this.activated = [selected.id]
      else
        this.activated = []
    }
  },

  methods: {
    show(item) {
      let obj = this.getObject(item.id);
      obj.visible = !obj.visible;
    },

    remove(item) {
      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        let obj = this.getObject(item.id);
        obj.parent.remove(obj);
      }
    },

    getObject(id) {
      let obj;
      window.three.scene.traverse((child) => {
        if (child.id == id) {
          obj = child;
        }
      });

      return obj;
    },

    select(activated) {
      if (activated.length === 0) return;
      if (this.selected && this.selected.id === activated[0]) return;
      let obj = this.getObject(activated[0]);
      window.three.select(obj);
    },

    isSelected(item) {
      let obj = this.getObject(item.id);
      return window.three.selected === obj;
    },

    getColor(item) {
      let obj = this.getObject(item.id);
      if (obj.color) return obj.color;
      if (obj.material) return obj.material.color;
    },

    changeColor(item) {
      this.colorObj = this.getObject(item.id);
      let color = this.getColor(item);
      this.showColorPicker = true;
      setTimeout(() => {
        this.color.rgba = {
          r: color.r * 255,
          g: color.g * 255,
          b: color.b * 255,
          a: 1,
        };
      }, 50);
    },

    confirmColor() {
      this.showColorPicker = false;
      console.log(this.color);
      if (this.colorObj.color) {
        this.colorObj.color.setRGB(
          this.color.rgba.r / 255,
          this.color.rgba.g / 255,
          this.color.rgba.b / 255
        );
      } else {
        this.colorObj.material.color.setRGB(
          this.color.rgba.r / 255,
          this.color.rgba.g / 255,
          this.color.rgba.b / 255
        );
      }
    },

    cancelColor() {
      this.showColorPicker = false;
    },

    showHdri() {
      if (this.useHdri) {
        window.three.scene.background = window.three.hdri;
        window.three.scene.environment = window.three.hdri;
      } else {
        window.three.scene.background = new THREE.Color(0x1e1e1e);
        window.three.scene.environment = null;
      }
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>