<template>
  <div v-if="nodeEntry.properties">
    <div
      v-for="(property, index) in nodeEntry.properties"
      :key="'entry' + index"
      cols="12"
    >
      <div v-for="(entry, index) in property" :key="'node' + index">
        <node :node-entry="entry" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";

import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "LineNode",
  components: { Node: () => import("./Node.vue") },
  props: {
    nodeEntry: {
      type: Object as PropType<GenericNodeFrequencyEntry>,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
