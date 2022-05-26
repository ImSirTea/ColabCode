<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <router-link to="/" custom v-slot="{href}">
        <v-btn dark text :to="href">
          <span>Home</span>
        </v-btn>
      </router-link>

      <router-link to="/overlay" custom v-slot="{href}">
        <v-btn dark text :to="href">
          <span>Overlaying</span>
        </v-btn>
      </router-link>

      <router-link to="/analysis" custom v-slot="{href}">
        <v-btn dark text :to="href">
          <span>Analysis</span>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
