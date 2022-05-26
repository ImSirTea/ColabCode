<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col ref="canvasContainer" class="canvasContainer" cols="auto">
        <overlay-canvas :room-id="roomId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import OverlayCanvas from "@/components/code_colab/OverlayCanvas.vue";

export default Vue.extend({
  name: "Overlay",
  components: { OverlayCanvas },
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="sass">
.code-canvas-container
  margin: 1em auto
  width: 90vw
  height: 80vh
  outline: 1px solid lightblue
  overflow: auto
</style>
