<template>
  <span class="keyword">{{ keyword }}</span>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "KeywordRenderer",
  props: {
    keyword: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="sass"></style>
