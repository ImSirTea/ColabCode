<template>
  <div class="unknown-node"></div>
</template>
<script lang="ts">
import { UnknownNode } from "@server/src/analyzerv2/Unknown";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "UnknownNode",
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<UnknownNode["getMostCommon"]>>,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
