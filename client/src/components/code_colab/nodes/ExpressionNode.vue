<template>
  <div v-if="expressionNode" class="d-inline expression-node">
    <node :node-entry="expressionNode" />
  </div>
</template>
<script lang="ts">
import { ExpressionNode } from "@server/src/analyzerv2/Expression";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "ExpressionNode",
  components: { Node: () => import("./Node.vue") },
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<ExpressionNode["getAllFrequencies"]>>,
      required: true,
    },
  },
  computed: {
    expressionNode: function (): GenericNodeFrequencyEntry {
      return this.nodeEntry.properties.expression[0];
    },
  },
});
</script>

<style lang="sass"></style>
