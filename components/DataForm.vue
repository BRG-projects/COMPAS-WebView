<template>
  <v-overlay :value="overlay">
    <v-card light flat max-height="800" min-height="100" min-width="500" class="scroll">
      <v-treeview :items="dataView"></v-treeview>
    </v-card>
    <v-btn @click="overlay = false" light class="mt-5">close</v-btn>
  </v-overlay>
</template>
<script>
export default {
  name: "DataForm",
  created() {
    this.$root.$on("showData", (data) => {
      console.log(data);
      this.overlay = true;
      this.mapData(data);
    });
  },

  data() {
    return {
      overlay: false,
      dataView: [],
    };
  },

  methods: {
    changeColor(color) {
      this.threeColorObj = color;
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
      this.threeColorObj.setRGB(
        this.color.rgba.r / 255,
        this.color.rgba.g / 255,
        this.color.rgba.b / 255
      );
      this.threeColorObj = null;
    },

    cancelColor() {
      this.showColorPicker = false;
      this.threeColorObj = null;
    },

    mapData(data) {
      let id = 0;

      let add_entries = (data) => {
        let tree = [];

        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            tree.push({
              id: id++,
              name: `${key} : []`,
              children: add_entries(value),
            });
          } else if (typeof value === "object" && value) {
            tree.push({
              id: id++,
              name: `${key} : {}`,
              children: add_entries(value),
            });
          } else {
            tree.push({
              id: id++,
              name: `${key} : ${value}`,
            });
          }
        }

        return tree;
      };

      this.dataView = add_entries(data);
    },
  },
};
</script>

<style>
.scroll {
  overflow-y: scroll;
}

.v-data-table__wrapper > table > tbody > tr:hover {
  background: inherit !important;
}
</style>