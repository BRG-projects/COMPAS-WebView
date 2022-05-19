<template>
  <v-list>
    <v-list-item v-if="animations.length == 0">
      <v-list-item-content> No animations available. </v-list-item-content>
    </v-list-item>

    <v-list-item v-for="(anime, i) in animations" :key="i">
      <v-list-item-content>
        <v-list-item-title>{{ anime.name }}</v-list-item-title>
        <div>
          <v-icon color="green" @click="anime.action.play()">mdi-play</v-icon>
          <v-icon color="red" @click="anime.action.stop()">mdi-stop</v-icon>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>

export default {
  name: "Animation",

  computed: {
    animations(){
        if (window.animations) {
            return window.animations;
        }
        else{
            return [];
        }
    }
  },
};
</script>
