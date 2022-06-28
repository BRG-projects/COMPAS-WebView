<template>
  <v-overlay :value="show">
    <v-card min-width="500">
      <v-card-title>Settings</v-card-title>
      <v-data-table
        :headers="headers"
        :items="settingsView"
        :hide-default-header="true"
        :hide-default-footer="true"
      >
        <template v-slot:item.value="{ item }">
          <span>
            {{ item.value }}
          </span>
          <v-btn
            v-if="item.color"
            :color="item.color"
          ></v-btn>
          <v-card v-if="editingColorKey === item.key" class="my-2">
            <v-color-picker
              v-model="editingColorValue"
              dot-size="19"
              swatches-max-height="200"
            ></v-color-picker>
            <v-btn color="primary" @click="confirmColor">Apply</v-btn>
            <v-btn @click="editingColorKey = null">Cancel</v-btn>
          </v-card>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-btn @click="hideSettings">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "SettingsForm",
  // created() {
  //   this.$root.$on("showSettings", ({id, settings}) => {
  //     this.show = true;
  //     this.items = this.mapSettings(settings);
  //     this.id = id;
  //     this.settings = settings;
  //   });
  // },

  computed: mapState("settings", ["settingsView", "id", "show"]),

  data() {
    return {
      headers: [
        { text: "Key", value: "key" },
        { text: "Value", value: "value" },
      ],
      settings: {},
      editingColorKey: null,
      editingColorValue: null,
    };
  },

  methods: {
    ...mapActions("settings", ["hideSettings"]),

    confirmColor() {
      let color = this.settings[this.editingColorKey].value;
      color.red = this.editingColorValue.rgba.r / 255;
      color.green = this.editingColorValue.rgba.g / 255;
      color.blue = this.editingColorValue.rgba.b / 255;
      this.editingColorKey = null;
      this.items = this.mapSettings(this.settings);

      console.log(this.id);
      three.objectsGroup.traverse((obj) => {
        if (obj.id === this.id) {
          obj.updateFromSettings();
        }
      });
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