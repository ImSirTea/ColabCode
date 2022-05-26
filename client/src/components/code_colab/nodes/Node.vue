<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto">
        <component :is="getComponentForKind(node)" :node="node" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GenericNode } from "@server/src/analyzerv2/Generic";
import { getComponentForKind } from "./nodes";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "Node",
  props: {
    node: {
      type: Object as PropType<GenericNode>,
      required: true,
    },
  },
  methods: {
    getComponentForKind,
  },
});
</script>

<style lang="sass"></style>
