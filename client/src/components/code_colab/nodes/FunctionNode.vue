<template>
  <div v-if="isArrowFunction" class="function-node">
    const
    <frequency-hover
      :frequency-entries="nameFrequencies"
      :total-frequency="nodeEntry.frequency"
    />
    ={{ isAsync ? " async " : " " }} (<node
      v-for="(param, index) in parameterNodes"
      :key="'param' + index"
      :node-entry="param"
    />) => {
    <node :node-entry="bodyNode" />
    }
  </div>
  <div v-else class="function-node">
    {{ isAsync ? " async " : " " }} function
    <frequency-hover
      :frequency-entries="nameFrequencies"
      :total-frequency="nodeEntry.frequency"
    />(<node
      v-for="(param, index) in parameterNodes"
      :key="'param' + index"
      :node-entry="param"
    />) {
    <node :node-entry="bodyNode" />
    }
  </div>
</template>
<script lang="ts">
import FrequencyHover from "@/components/code_colab/FrequencyHover.vue";
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";
import { FunctionNode } from "@server/src/analyzerv2/Function";
import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "FunctionNode",
  components: {
    Node: () => import("./Node.vue"),
    FrequencyHover,
  },
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
  computed: {
    isArrowFunction: function (): boolean {
      return this.nodeEntry.properties.arrow[0].value === true;
    },
    isAsync: function (): boolean {
      return this.nodeEntry.properties.async[0].value === true;
    },
    asyncFrequencies: function (): FrequencyEntry<boolean>[] {
      return this.nodeEntry.properties.async;
    },
    nameFrequencies: function (): FrequencyEntry<string>[] {
      return this.nodeEntry.properties.name;
    },
    parameterNodes: function (): ReturnType<
      FunctionNode["getAllFrequencies"]
    >["properties"]["parameters"] {
      const relevantParams = this.nodeEntry.properties.parameters.filter(
        (param) => param.frequency >= this.nodeEntry.frequency / 2
      );

      // const reducedParams = relevantParams.reduce((paramString, param) => {
      //   const properties = param.properties;

      //   const name = properties.name[0].value;
      //   const initial = "TODO"; //TODO: Get initial value from here, isn't simple by da looks

      //   return (paramString += name + " = " + initial);
      // }, "");

      return relevantParams;
    },
    bodyNode: function (): GenericNodeFrequencyEntry {
      return this.nodeEntry.properties.body[0];
    },
  },
});
</script>

<style lang="sass"></style>
