<template>
  <v-card outlined>
    <v-card-title>Property</v-card-title>
    <v-data-table
      :headers="headers"
      :items="properties"
      :hide-default-header="true"
      :hide-default-footer="true"
    >
      <template v-slot:item.value="{ item }">
        <span>
          {{ item.value }}
        </span>
        <v-icon v-if="item.data" @click="showData(item.data)"
          >mdi-database-eye
        </v-icon>
        <v-icon
          v-if="item.key === 'settings'"
          @click="showSettings(id)"
          >mdi-cog
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Property",
  data() {
    return {
      headers: [
        { text: "Key", value: "key" },
        { text: "Value", value: "value" },
      ],
    };
  },
  computed: mapState("property", ["properties", "id"]),
  methods: {
    ...mapActions("data", ["showData"]),
    ...mapActions("settings", ["showSettings"]),
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