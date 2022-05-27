<template>
  <div v-if="expressionNode" class="d-inline expression-node">
    <frequency-hover
      :frequency-entries="nameFrequencies"
      :total-frequency="nodeEntry.frequency"
    />
  </div>
</template>
<script lang="ts">
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";
import { IdentifierNode } from "@server/src/analyzerv2/Identifier";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "IdentifiedNode",
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<IdentifierNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    nameFrequencies: function (): FrequencyEntry<string>[] {
      return this.nodeEntry.properties.name;
    },
  },
});
</script>

<style lang="sass"></style>
