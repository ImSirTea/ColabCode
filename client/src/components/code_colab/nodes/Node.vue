<template>
  <component :is="getComponentForKind(nodeEntry)" :nodeEntry="nodeEntry" />
</template>

<script lang="ts">
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import { getComponentForKind } from "./nodes";
import Vue, { PropType } from "vue";
import { FrequencyList } from "@server/src/analyzerv2/FrequencyList";

export default Vue.extend({
  name: "Node",
  props: {
    nodeEntry: {
      type: Object as PropType<GenericNodeFrequencyEntry | FrequencyList<any>>,
      required: true,
    },
  },
  methods: {
    getComponentForKind,
  },
});
</script>

<style lang="scss">
@import "@/assets/colours.scss";

.function-node {
  color: $_default;
}

.keyword {
  color: $keyword;
}
</style>
