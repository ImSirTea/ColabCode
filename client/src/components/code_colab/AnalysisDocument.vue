<template>
  <v-container fluid>
    <v-alert v-if="errorFetching" type="error">
      Failed to fetch average code submissions for room `{{ roomId }}`, is this
      the correct room?
    </v-alert>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <block-node v-if="mostCommonCode" :nodes="mostCommonCode.lines" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  getMostCommonCodeSubmission,
  TempMostCommon,
} from "@/api/codeSubmissions";
import Vue from "vue";
import BlockNode from "@/components/code_colab/nodes/BlockNode.vue";

export default Vue.extend({
  name: "AnalysisDocument",
  components: { BlockNode },
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data: () => ({
    mostCommonCode: null as TempMostCommon | null,
    refreshIntervalRef: null as number | null,
    errorFetching: false,
  }),
  mounted() {
    this.refreshIntervalRef = setInterval(async () => {
      if (this.roomId) {
        try {
          this.mostCommonCode = await getMostCommonCodeSubmission(this.roomId);
          this.errorFetching = false;
        } catch {
          this.errorFetching = true;
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.refreshIntervalRef) {
      clearInterval(this.refreshIntervalRef);
    }
  },
});
</script>

<style lang="sass"></style>
