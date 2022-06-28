<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <v-row class="ma-1">
          {{ mode }}
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            class="ml-1 pa-2"
            min-width="0"
            :color="attributesVisibility['vertices'] ? 'primary' : null"
            @click="toggleAttributesVisibility('vertices')"
          >
            <v-icon small> mdi-square-medium-outline </v-icon>
          </v-btn>

          <v-btn
            small
            outlined
            class="ml-1 pa-2"
            min-width="0"
            :color="attributesVisibility['edges'] ? 'primary' : null"
            @click="toggleAttributesVisibility('edges')"
          >
            <v-icon small> mdi-vector-line </v-icon>
          </v-btn>
          <v-btn
            small
            outlined
            class="ml-1 pa-2"
            min-width="0"
            :color="attributesVisibility['faces'] ? 'primary' : null"
            @click="toggleAttributesVisibility('faces')"
          >
            <v-icon small> mdi-vector-triangle </v-icon>
          </v-btn>
        </v-row>
      </v-card-title>

      <v-card class="scroll" :height="halfHeight" flat>
        <v-treeview
          :items="tree"
          dense
          hoverable
          :active="[selected]"
          :open="opened"
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
              @click="select(item.id)"
            >
              {{ item.name }}
            </span>
          </template>
          <template v-slot:append="{ item }">
            <v-icon v-if="mode === 'Scene'" @click="toggleVisibility(item.id)">
              {{ item.visible ? "mdi-eye" : "mdi-eye-off" }}
            </v-icon>
            <v-icon v-if="mode === 'Scene'" @click="remove(item)">
              mdi-delete
            </v-icon>
            <v-icon v-if="mode === 'Scene'" @click.prevent="focus(item)">
              mdi-crosshairs
            </v-icon>
            <!-- <v-icon
              v-if="mode === 'Scene' && getObject(item.id).data"
              @click="editAttributes(item)"
            >
              mdi-graph
            </v-icon> -->
          </template>
        </v-treeview>
      </v-card>
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
import { mapActions, mapState } from "vuex";
import Property from "./Property.vue";

export default {
  name: "Scene",

  components: {
    Property,
  },

  computed: {
    ...mapState("scene", ["mode", "tree", "selected", "attributesVisibility"]),

    halfHeight() {
      return (document.body.clientHeight - 48) / 2;
    },
  },

  data() {
    return {
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
      attributeMode: "vertices",
    };
  },

  watch: {
    attributeMode(value) {
      three.attributeMode = value;
    },
  },

  mounted() {
    this.updateTree();
    this.$root.$on("highlight", this.highlight);
  },

  methods: {
    ...mapActions("scene", [
      "select",
      "updateTree",
      "toggleVisibility",
      "toggleAttributesVisibility",
      "getObject",
      "removeObject",
    ]),

    async highlight() {
      if (this.selected) {
        let path = await this.findPath(this.selected);
        this.opened = path;
        this.scrollTo(this.selected);
      }
    },

    remove(item) {
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        this.removeObject(item.id);
      }
    },

    async findPath(id) {
      let path = [];
      let obj = await this.getObject(id);
      while (obj.parent) {
        path.push(obj.parent.id);
        obj = obj.parent;
      }
      path.pop();
      return path.reverse();
    },

    async focus(item) {
      let obj = await this.getObject(item.id);
      three.focus(obj);
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
      this.$root.$emit("showAttributes", ["vertices", "edges", "faces"]);
    },

    exitEditAttributes() {
      three.exitEditAttributes();
      this.$root.$emit("showAttributes", ["faces"]);
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