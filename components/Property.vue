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
        <v-icon v-if="item.color" @click="changeColor(item.color)"
          >mdi-palette
        </v-icon>
        <v-icon v-if="item.data" @click="showData(item.data)"
          >mdi-database-eye
        </v-icon>
        <v-icon v-if="item.settings" @click="$root.$emit('showSettings', {id, settings: item.settings})"
          >mdi-cog
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';


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

.v-data-table__wrapper > table > tbody > tr:hover {
  background: inherit !important;
}
</style>