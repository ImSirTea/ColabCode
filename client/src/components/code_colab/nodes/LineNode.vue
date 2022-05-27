<template>
  <div v-if="nodeEntry.properties" class="line-node">
    <node :node-entry="lineNode" />
  </div>
</template>

<script lang="ts">
import { LineNode } from "@server/src/analyzerv2/Block";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";

import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "LineNode",
  components: { Node: () => import("./Node.vue") },
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<LineNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    lineNode: function (): GenericNodeFrequencyEntry {
      return this.nodeEntry.properties.line[0];
    },
  },
});
</script>

<style lang="sass"></style>
