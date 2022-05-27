<template>
  <div class="d-inline variable-node">
    <frequency-hover
      :frequency-entries="subkindEntries"
      :total-frequency="nodeEntry.frequency"
    />

    <frequency-hover
      :frequency-entries="nameEntries"
      :total-frequency="nodeEntry.frequency"
    />
    = <node :node-entry="valueNode" />;
  </div>
</template>
<script lang="ts">
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import { VariableNode } from "@server/src/analyzerv2/Variable";
import Vue, { PropType } from "vue";
import FrequencyHover from "@/components/code_colab/FrequencyHover.vue";
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";

export default Vue.extend({
  name: "VariableNode",
  components: { Node: () => import("./Node.vue"), FrequencyHover },
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<VariableNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    nameEntries: function (): FrequencyEntry<string>[] {
      return this.nodeEntry.properties.name;
    },
    subkindEntries: function (): FrequencyEntry<string>[] {
      return this.nodeEntry.properties.subkind;
    },
    valueNode: function (): GenericNodeFrequencyEntry {
      return this.nodeEntry.properties.value[0];
    },
  },
});
</script>

<style lang="sass"></style>
