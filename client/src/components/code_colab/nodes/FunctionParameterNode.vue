<template>
  <div class="d-inline function-parameter-node">
    <!-- TODO: InitialValue bullshit idk man -->
    <frequency-hover
      :frequency-entries="nameFrequencies"
      :total-frequency="nodeEntry.frequency"
    />
    = <node :node-entry="initialValueNode" />
  </div>
</template>
<script lang="ts">
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";
import { FunctionParameterNode } from "@server/src/analyzerv2/Function";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import FrequencyHover from "@/components/code_colab/FrequencyHover.vue";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "FunctionParameterNode",
  components: { Node: () => import("./Node.vue"), FrequencyHover },
  props: {
    nodeEntry: {
      type: Object as PropType<
        ReturnType<FunctionParameterNode["getAllFrequencies"]>
      >,
      required: true,
    },
  },
  computed: {
    nameFrequencies: function (): FrequencyEntry<string>[] {
      return this.nodeEntry.properties.name;
    },
    initialValueNode: function (): GenericNodeFrequencyEntry {
      return this.nodeEntry.properties.initial[0];
    },
  },
});
</script>

<style lang="scss">
.function-parameter-node {
  &:not(:last-of-type)::after {
    content: ", ";
  }
}
</style>
