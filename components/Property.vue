<template>
  <v-card color="black">
    <v-card-title>Property</v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :hide-default-header="true"
      :hide-default-footer="true"
    >
      <template v-slot:item.value="{ item }">
        <span>
          {{ item.value }}
        </span>
        <v-icon v-if="item.color" @click="changeColor(item.color)"
          >mdi-palette
        </v-icon>
        <v-icon v-if="item.data" @click="showData(item.data)"
          >mdi-database-eye
        </v-icon>
        <div v-if="showColorPicker && item.color">
          <v-color-picker
            v-model="color"
            dot-size="19"
            swatches-max-height="200"
          ></v-color-picker>
          <v-btn color="primary" @click="confirmColor">Apply</v-btn>
          <v-btn @click="cancelColor">Cancel</v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>

export default {
  name: "Property",
  created() {
    this.$root.$on("showProperty", (properties) => {
      this.show = true;
      this.items = properties;
    });

    this.$root.$on("hideProperty", () => {
      this.show = false;
      this.items = [];
    });
  },

  data() {
    return {
      show: false,
      headers: [
        { text: "Key", value: "key" },
        { text: "Value", value: "value" },
      ],
      items: [],

      showColorPicker: false,
      color: null,
      threeColorObj: null,
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

    showData(data) {
      this.$root.$emit("showData", data);
    },
  },
};
</script>

<style>
.scroll {
  overflow-y: scroll;
}

.v-data-table__wrapper {
  background: black;
}

.v-data-table__wrapper > table > tbody > tr:hover {
  background: inherit !important;
}
</style>