<template>
  <div></div>
</template>
<script lang="ts">
import { VariableNode } from "@server/src/analyzerv2/Variable";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "ExpressionNode",
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<VariableNode["getMostCommon"]>>,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
