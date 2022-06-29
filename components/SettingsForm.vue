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
            @click="setEditingColorKey(item.key)"
          ></v-btn>
          <v-card v-if="editingColorKey === item.key" class="my-2">
            <v-color-picker
              v-model="editingColorValue"
              dot-size="19"
              swatches-max-height="200"
            ></v-color-picker>
            <v-btn color="primary" @click="applyColor(editingColorValue)"
              >Apply</v-btn
            >
            <v-btn @click="setEditingColorKey(null)">Cancel</v-btn>
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
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "SettingsForm",

  computed: mapState("settings", [
    "settingsView",
    "id",
    "show",
    "editingColorKey",
  ]),

  data() {
    return {
      headers: [
        { text: "Key", value: "key" },
        { text: "Value", value: "value" },
      ],
      settings: {},
      editingColorValue: null,
    };
  },

  methods: {
    ...mapActions("settings", ["hideSettings", "applyColor"]),
    ...mapMutations("settings", ["setEditingColorKey"]),
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