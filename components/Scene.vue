<template>
  <v-container>
    <v-card class="scroll" outlined :height="halfHeight">
      <v-card-title>{{ mode }}</v-card-title>
      <v-treeview
        :items="tree"
        dense
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
          <v-icon v-if="getObject(item.id).data" @click="editAttributes(item)">
            mdi-graph
          </v-icon>
        </template>
      </v-treeview>
    </v-card>

    <div v-if="mode === 'Attributes'">
      <v-radio-group v-model="attributeMode">
        <v-radio value="vertices" label="vertices"></v-radio>
        <v-radio value="edges" label="edges"></v-radio>
        <v-radio value="faces" label="faces"></v-radio>
      </v-radio-group>
      <v-btn class="my-2" @click="exitEditAttributes()"
        >Exit Edit Attributes</v-btn
      >
    </div>

    <v-divider class="my-5"></v-divider>

    <Property />
  </v-container>
</template>

<script>
import Property from "./Property.vue";

export default {
  name: "Scene",

  components: {
    Property,
  },

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

    halfHeight() {
      return (document.body.clientHeight - 48) / 2;
    },

    mode() {
      if (three) return three.mode;
    },
  },

  data() {
    return {
      tree: [],
      opened: [],
      icons: {
        Group: "mdi-folder-multiple",
        Mesh: "mdi-vector-triangle",
        PerspectiveCamera: "mdi-camera",
        PointLight: "mdi-lightbulb",
        AmbientLight: "mdi-lightbulb",
        AxesHelper: "mdi-axis",
        GridHelper: "mdi-axis",
        LineSegments: "mdi-vector-line",
        Points: "mdi-square-medium-outline",
      },
      activated: [],
      attributeEditingObject: null,
      attributeMode: "vertices",
    };
  },

  watch: {
    selected() {
      this.updateActivated();
    },

    attributeMode(value) {
      three.attributeMode = value;
    },
  },

  mounted() {
    this.updateTree();
    this.updateActivated();
  },

  methods: {
    updateTree(object) {
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

      this.tree = getChildren(object || three.objectsGroup);
      console.log("update tree", this.tree);
    },

    toggleVisibility(item) {
      item.visible = !item.visible;
      this.getObject(item.id).visible = item.visible;
    },

    activate(item) {
      this.activated = [item.id];
      this.showProperty(item);
    },

    updateActivated() {
      if (this.selected) {
        this.activated = [this.selected.id];
        let path = this.findPath(this.activated[0]);
        this.opened = path;
        this.scrollTo(this.activated[0]);

        let item = this.getItem(this.activated[0]);
        console.log("updateActivated", this.activated[0]);
        console.log("item", item);
        if (item) {
          this.showProperty(item);
        }
      } else this.activated = [];
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
      let obj = {};
      three.scene.traverse((child) => {
        if (child.id == id) {
          obj = child;
        }
      });

      return obj;
    },

    getItem(id) {
      let found = {};
      let findItem = (parent, id, found) => {
        if (parent.id == id) {
          found.item = parent;
        } else if (parent.children) {
          parent.children.forEach((child) => {
            findItem(child, id, found);
          });
        }
      };

      findItem({ children: this.tree }, id, found);

      return found.item;
    },

    select(activated) {
      if (this.mode === "Attributes") return;
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

    editAttributes(item) {
      let obj = this.getObject(item.id);
      three.editAttributes(obj);
      this.updateTree(obj);
    },

    exitEditAttributes() {
      three.exitEditAttributes();
      this.updateTree();
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.scroll {
  overflow-y: scroll;
}
</style>