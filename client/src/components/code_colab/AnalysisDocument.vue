<template>
  <v-container fluid>
    <v-alert v-if="errorFetching" type="error">
      Failed to fetch average code submissions for room `{{ roomId }}`, is this
      the correct room?
    </v-alert>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <node v-if="mostCommonCode" :node-entry="mostCommonCode" class="node" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { getCodeFrequencies } from "@/api/codeSubmissions";
import Vue from "vue";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import Node from "@/components/code_colab/nodes/Node.vue";

export default Vue.extend({
  name: "AnalysisDocument",
  components: { Node },
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data: () => ({
    mostCommonCode: null as GenericNodeFrequencyEntry | null,
    refreshIntervalRef: null as number | null,
    errorFetching: false,
  }),
  mounted() {
    this.refreshIntervalRef = setInterval(async () => {
      if (this.roomId) {
        try {
          this.mostCommonCode = await getCodeFrequencies(this.roomId);
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

<style lang="scss">
.node {
  font-family: monospace;
}
</style>
