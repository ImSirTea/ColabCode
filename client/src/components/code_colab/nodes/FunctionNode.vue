<script lang="ts">
import { FunctionNode } from "@server/src/analyzerv2/Function";
import { getComponentForKind } from "./nodes";
import Vue, { PropType, CreateElement as h } from "vue";

export default Vue.extend({
  name: "FunctionNode",
  props: {
    node: {
      type: Object as PropType<ReturnType<FunctionNode["getMostCommon"]>>,
      required: true,
    },
  },
  methods: {
    getComponentForKind,
  },
  computed: {
    functionType: function() {
      if (this.node.arrow) {
        h()
      }
    },
    functionName: function() {

    },
    functionParameters: function() {

    }
  },
  render:
});
</script>

<style lang="sass"></style>
