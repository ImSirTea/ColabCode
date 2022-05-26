<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col v-for="(node, index) in nodes" :key="index" cols="12">
        <node :node="node" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GenericNode } from "@server/src/analyzerv2/Generic";
import Node from "@/components/code_colab/nodes/Node.vue";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "BlockNode",
  components: {
    Node,
  },
  props: {
    nodes: {
      type: Array as PropType<GenericNode[]>,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
