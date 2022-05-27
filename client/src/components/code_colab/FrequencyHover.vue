<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" v-bind="attrs">
        <slot>{{ value }}</slot>
      </span>
    </template>
    <v-list>
      <v-list-item
        v-for="(entry, index) in frequencyEntries"
        :key="'frequency-' + index"
        class="border-bottom"
      >
        <v-list-item-content>
          {{ entry.value }} - {{ (entry.frequency / totalFrequency) * 100 }}%
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
import { FrequencyEntry } from "@server/src/analyzerv2/FrequencyList";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "FrequencyHover",
  props: {
    frequencyEntries: {
      type: Array as PropType<FrequencyEntry<any>[]>,
      required: true,
    },
    totalFrequency: {
      type: Number,
      required: true,
    },
  },
  computed: {
    value: function (): string {
      this.$attrs.class;
      return this.frequencyEntries[0].value;
    },
  },
});
</script>

<style lang="sass">
.border-bottom:not(:last-child)
  border-bottom: 1px solid slategray
</style>
