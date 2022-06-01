<template>
  <v-overlay :value="overlay">
    <v-card>
      <v-card-title>Property</v-card-title>
      <v-data-table :headers="headers" :items="items" :items-per-page="15">
        <template v-slot:item.value="{ item }">
          <span>
            {{ item.value }}
          </span>
          <v-icon v-if="item.color" @click="changeColor(item.color)"
            >mdi-palette
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

      <v-card-actions>
        <v-btn @click="overlay = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script>
export default {
  name: "Property",
  created() {
    this.$root.$on("showProperty", (properties) => {
      this.overlay = true;
      this.items = properties;
    });
  },

  data() {
    return {
      overlay: false,
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
  },
};
</script>