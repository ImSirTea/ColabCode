<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <router-link to="/" custom v-slot="{ href }">
        <v-btn dark text :to="href">
          <span>Home</span>
        </v-btn>
      </router-link>

      <router-link to="/overlay" custom v-slot="{ href }">
        <v-btn dark text :to="href">
          <span>Overlaying</span>
        </v-btn>
      </router-link>

      <router-link to="/analysis" custom v-slot="{ href }">
        <v-btn dark text :to="href">
          <span>Analysis</span>
        </v-btn>
      </router-link>

      <v-spacer />

      <v-container fluid>
        <v-row justify="end" align="center">
          <v-col cols="12" sm="6" md="4" lg="3" xl="2">
            <v-text-field
              v-model="roomId"
              placeholder="Room Code To View"
              hide-details
              autofocus
            />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import router from "@/router";

export default Vue.extend({
  name: "App",
  data: function () {
    return {
      roomId: "",
    };
  },
  watch: {
    roomId: function () {
      router.push({ params: { roomId: this.roomId } });
    },
  },
});
</script>
