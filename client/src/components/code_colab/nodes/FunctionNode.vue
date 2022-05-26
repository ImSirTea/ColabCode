<template>
  <div></div>
</template>
<script lang="ts">
import { FunctionNode } from "@server/src/analyzerv2/Function";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "FunctionNode",
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<FunctionNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  methods: {
    test: function () {
      this.nodeEntry.kind;
    },
  },
});
</script>

<style lang="sass"></style>
