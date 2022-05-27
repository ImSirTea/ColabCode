<template>
  <div class="d-inline literal-node">
    <frequency-hover
      :frequency-entries="valueFrequencies"
      :total-frequency="nodeEntry.frequency"
    >
      {{ value }}
    </frequency-hover>
  </div>
</template>
<script lang="ts">
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";
import { LiteralNode } from "@server/src/analyzerv2/Literal";
import FrequencyHover from "@/components/code_colab/FrequencyHover.vue";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "LiteralNode",
  components: { FrequencyHover },
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<LiteralNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    valueFrequencies: function (): FrequencyEntry<string | number>[] {
      return this.nodeEntry.properties.value;
    },
    value: function (): string {
      const value = this.nodeEntry.properties.value[0].value;
      if (typeof value === "string") {
        return `"${value}"`;
      }
      return `${value}`;
    },
  },
});
</script>

<style lang="sass"></style>
