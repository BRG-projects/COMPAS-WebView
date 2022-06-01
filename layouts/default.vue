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
    <Property />
    <!-- <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import Controller from "../components/Controller";
import Property from "../components/Property";
import { mapState, mapActions } from "vuex";

export default {
  name: "DefaultLayout",
  components: {
    Controller,
    Property
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
      title: "GLTF Viewer",
    };
  },

  methods: {
    ...mapActions(["toggleController"]),
  },
};
</script>
