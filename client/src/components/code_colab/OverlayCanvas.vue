<template>
  <v-container fluid>
    <v-alert v-if="errorFetching" type="error">
      Failed to fetch code submissions for room `{{ roomId }}`, is this the
      correct room?
    </v-alert>
    <v-row justify="center" align="center">
      <v-col ref="canvasContainer" class="canvasContainer" cols="auto">
        <canvas ref="canvas" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllCodeSubmissions } from "../../api/codeSubmissions";
import { highlight, languages } from "prismjs";
import { NodeType, parse, TextNode } from "node-html-parser";

// Colours is not type safe, but so much less hassle to deal with
const colours: Record<string, string> = {
  _default: "#000",
  comment: "slategray",
  prolog: "slategray",
  doctype: "slategray",
  cdata: "slategray",
  punctuation: "#999",
  namespace: "#905",
  property: "#905",
  tag: "#905",
  boolean: "#905",
  number: "#905",
  constant: "#905",
  symbol: "#905",
  deleted: "#905",
  selector: "#690",
  "attr-name": "#690",
  string: "#690",
  char: "#690",
  builtin: "#690",
  inserted: "#690",
  operator: "#9a6e3a",
  entity: "#9a6e3a",
  url: "#9a6e3a",
  keyword: "#07a",
  "attr-value": "#07a",
  atrule: "#07a",
  function: "#DD4A68",
  "class-name": "#DD4A68",
  regex: "#e90",
  important: "#e90",
  variable: "#e90",
};

export default Vue.extend({
  name: "Overlay",
  props: {
    roomId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data: () => ({
    indent: 0,
    lineIndex: 0,
    alpha: 0,
    fontSize: 15,
    errorFetching: false,
    codeSubmissions: [] as string[],
    refreshIntervalRef: null as number | null,
  }),
  mounted() {
    this.refreshIntervalRef = setInterval(async () => {
      if (this.roomId) {
        try {
          this.codeSubmissions = await getAllCodeSubmissions(this.roomId);
          this.errorFetching = false;
          this.parseCodeSubmissions();
        } catch {
          this.errorFetching = true;
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    if (this.refreshIntervalRef) {
      clearInterval(this.refreshIntervalRef);
    }
  },
  methods: {
    parseCodeSubmissions: function () {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const canvasContainer = this.$refs.canvasContainer as HTMLDivElement;
      const ctx = canvas.getContext("2d");

      if (!canvas || !canvasContainer || !ctx) {
        return;
      }

      if (this.codeSubmissions.length === 0) {
        return;
      }

      this.alpha = 1 / this.codeSubmissions.length;

      const lineHeight = this.fontSize + 4;

      const codeGroups = this.codeSubmissions.map((codeSubmission) =>
        codeSubmission.split("\n")
      );

      const widestLine = Math.max(
        ...codeGroups.map((codeGroup) =>
          Math.max(
            ...codeGroup.map((codeLine) => ctx.measureText(codeLine).width)
          )
        )
      );

      const tallestCodeSubmission =
        Math.max(...codeGroups.map((codeGroup) => codeGroup.length)) + 1;

      canvas.width = widestLine;
      canvas.height = tallestCodeSubmission * lineHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${this.fontSize}px monospace`;

      this.codeSubmissions.forEach((codeSubmission) => {
        this.drawHighlightedCode(ctx, codeSubmission);
      });
    },
    drawTextToCanvas: function (
      ctx: CanvasRenderingContext2D,
      text: string,
      colour: string
    ) {
      const textWidth = ctx.measureText(text).width;

      this.indent += textWidth;

      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = colour;
      ctx.fillText(text, this.indent, this.lineIndex * this.fontSize);
    },
    drawHighlightedCode: function (
      ctx: CanvasRenderingContext2D,
      code: string
    ) {
      const highlightedCode = highlight(code, languages.js, "js").replace(
        /\n/g,
        "<br>"
      );

      const parsedCode = parse(highlightedCode);
      const codeNodes = parsedCode.childNodes;

      ctx.save();

      ctx.textBaseline = "top";
      ctx.textAlign = "right";

      codeNodes.forEach((node) => {
        if (node.nodeType === NodeType.ELEMENT_NODE) {
          const element = node as unknown as HTMLElement;

          if (element.tagName === "BR") {
            this.indent = 0;
            this.lineIndex += 1;
            return;
          }

          const text = element.textContent ?? "";
          const className = element.classList.value
            ? element.classList.value[element.classList.value.length - 1]
            : null;
          const colour = className ? colours[className] : colours["_default"];

          this.drawTextToCanvas(ctx, text, colour);

          return;
        }

        if (node.nodeType === NodeType.TEXT_NODE) {
          const textNode = node as unknown as TextNode;

          const text = textNode.rawText;
          const colour = colours["_default"];

          this.drawTextToCanvas(ctx, text, colour);

          return;
        }

        if (node.nodeType === NodeType.COMMENT_NODE) {
          // Ignored for now
        }
      });

      this.indent = 0;
      this.lineIndex = 0;

      ctx.restore();
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
