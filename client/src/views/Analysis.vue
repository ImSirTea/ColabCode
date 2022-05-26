<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <analysis-document :room-id="roomId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import AnalysisDocument from "@/components/code_colab/AnalysisDocument.vue";

export default Vue.extend({
  name: "Analysis",
  components: { AnalysisDocument },
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="sass"></style>
