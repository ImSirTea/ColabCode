<template>
  <div v-if="nodeEntry.properties" class="block-node">
    <node
      v-for="(entry, index) in blockNodes"
      :key="'block-node-' + index"
      :node-entry="entry"
      class="pl-4"
    />
  </div>
</template>

<script lang="ts">
import { BlockNode } from "@server/src/analyzerv2/Block";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";

import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "BlockNode",
  components: { Node: () => import("./Node.vue") },
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<BlockNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    blockNodes: function (): GenericNodeFrequencyEntry[] {
      return this.nodeEntry.properties.lines;
    },
  },
});
</script>

<style lang="sass"></style>
