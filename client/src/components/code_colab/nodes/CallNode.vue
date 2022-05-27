<template>
  <div class="d-inline call-node"></div>
</template>
<script lang="ts">
import { CallNode } from "@server/src/analyzerv2/Call";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "CallNode",
  props: {
    nodeEntry: {
      type: Object as PropType<ReturnType<CallNode["getAllFrequencies"]>>,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
