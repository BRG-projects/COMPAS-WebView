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
        <v-radio-group v-model="viewMode" label="View Mode" class="ml-10">
          <v-radio label="Normal" value="Normal" />
          <v-radio label="Ghosted" value="Ghosted" />
        </v-radio-group>
        <v-radio-group v-model="gimbal" label="Gimbal" class="ml-10">
          <v-radio label="On" :value="true" />
          <v-radio label="Off" :value="false" />
        </v-radio-group>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-card>
          <v-card-title>Scene</v-card-title>
          <v-treeview
            :items="tree"
            hoverable
            :active="activated"
            :open="opened"
            @update:open="onOpen"
            @update:active="select"
          >
            <template v-slot:prepend="{ item }">
              <v-icon>
                {{ icons[item.type] }}
              </v-icon>
            </template>
            <template v-slot:label="{ item }">
              <span
                class="pointer"
                :ref="`label_${item.id}`"
                @click.prevent="activate(item)"
              >
                {{ item.name }}
              </span>
            </template>
            <template v-slot:append="{ item }">
              <v-icon @click="toggleVisibility(item)">
                {{ item.visible ? "mdi-eye" : "mdi-eye-off" }}
              </v-icon>
              <v-icon
                v-if="item.name !== 'Default' && item.name !== 'GLTFs'"
                @click="remove(item)"
              >
                mdi-delete
              </v-icon>
              <v-icon
                v-if="item.name !== 'Default' && item.name !== 'GLTFs'"
                @click.prevent="focus(item)"
              >
                mdi-crosshairs
              </v-icon>
              <v-icon @click="showProperty(item)"> mdi-cog </v-icon>
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

  created() {
    this.$root.$on("updateTree", () => {
      this.updateTree();
    });
  },

  computed: {
    selected() {
      if (three) {
        return three.selected;
      } else {
        return null;
      }
    },
  },

  data() {
    return {
      tree: [],
      useHdri: false,
      upAxis: "Z",
      viewMode: "Normal",
      opened: [],
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
        LineSegments: "mdi-vector-line",
      },
      backgroundColor: 0x1e1e1e,
      activated: [],
      gimbal: false,
    };
  },

  watch: {
    upAxis(val) {
      if (val === "Y") {
        three.camera.up.set(0, 1, 0);
        three.controls.updateCameraUp();
      } else {
        three.camera.up.set(0, 0, 1);
        three.controls.updateCameraUp();
      }
    },

    backgroundColor(val) {
      three.scene.background.setHex(val);
    },

    selected(selected) {
      if (selected) {
        this.activated = [selected.id];
        let path = this.findPath(this.activated[0]);
        this.opened = path;
        this.scrollTo(this.activated[0]);
      } else this.activated = [];
    },

    viewMode(val) {
      if (val === "Normal") {
        three.edgeMaterial.depthTest = true;
      } else if (val === "Ghosted") {
        three.edgeMaterial.depthTest = false;
      }
    },

    gimbal(val) {
      if (val) {
        three.enableTransformControls = true;
        if (three.selected) {
          three.transformControls.attach(three.selected);
        }
      } else {
        three.enableTransformControls = false;
        three.transformControls.detach();
      }
    },
  },

  mounted() {
    this.updateTree();
  },

  methods: {
    updateTree() {
      if (!three) return [];
      let getChildren = (parent) => {
        return parent.children
          .filter((child) => child.name !== "Gimbal")
          .map((child) => {
            return {
              name: child.name ? child.name : `(${child.type})`,
              id: child.id,
              type: child.type,
              visible: child.visible,
              children: getChildren(child),
            };
          });
      };

      this.tree = getChildren(three.scene);
      console.log("update tree", this.tree);
    },

    toggleVisibility(item) {
      item.visible = !item.visible;
      this.getObject(item.id).visible = item.visible;
    },

    activate(item) {
      this.activated = [item.id];
    },

    onOpen(items) {
      console.log(items);
    },

    remove(item) {
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        let obj = this.getObject(item.id);
        obj.parent.remove(obj);
        this.updateTree();
      }
    },

    getObject(id) {
      let obj;
      three.scene.traverse((child) => {
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
      three.select(obj);
    },

    findPath(id) {
      let path = [];
      let obj = this.getObject(id);
      while (obj.parent) {
        path.push(obj.parent.id);
        obj = obj.parent;
      }
      path.pop();
      return path.reverse();
    },

    isSelected(item) {
      let obj = this.getObject(item.id);
      return three.selected === obj;
    },

    focus(item) {
      let obj = this.getObject(item.id);
      three.focus(obj);
      console.log(obj);
    },

    showProperty(item) {
      let obj = this.getObject(item.id);
      let properties = [
        {
          key: "id",
          value: item.id,
        },
        {
          key: "name",
          value: item.name,
        },
        {
          key: "type",
          value: item.type,
        },
        {
          key: "visible",
          value: item.visible,
        },
      ];

      if (obj.material) {
        properties.push({
          key: "material",
          value: obj.material.type,
          color: obj.material.color,
        });
      }

      if (obj.data) {
        properties.push({
          key: "data",
          value: obj.data.dtype,
          data: obj.data,
        });
      }

      this.$root.$emit("showProperty", properties);
    },

    showHdri() {
      if (this.useHdri) {
        three.scene.background = three.hdri;
        three.scene.environment = three.hdri;
      } else {
        three.scene.background = new THREE.Color(0x1e1e1e);
        three.scene.environment = null;
      }
    },

    scrollTo(id) {
      setTimeout(() => {
        let label = this.$refs[`label_${id}`];
        if (label)
          label.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
      }, 200);
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>