<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="toggleController">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <Controller/>
    <DataForm />
    <SettingsForm />
    <!-- <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import Controller from "../components/Controller";
import { mapState, mapActions } from "vuex";

import DataForm from "../components/DataForm.vue";
import SettingsForm from "../components/SettingsForm.vue";

export default {
  name: "DefaultLayout",
  components: {
    Controller,
    DataForm,
    SettingsForm
  },
  computed: mapState(["showController"]),

  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      title: "COMPAS WebView",
    };
  },

  methods: {
    ...mapActions(["toggleController"]),
  },
};
</script>
