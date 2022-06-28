<template>
  <v-overlay :value="show">
    <v-card
      light
      flat
      max-height="800"
      min-height="100"
      min-width="500"
      class="scroll"
    >
      <v-treeview :items="dataView"></v-treeview>
    </v-card>
    <v-btn @click="hideData" light class="mt-5">close</v-btn>
  </v-overlay>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "DataForm",
  computed: mapState("data", ["dataView", "show"]),
  methods: mapActions("data", ["hideData"]),
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