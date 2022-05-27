import { GenericNodeFrequencyEntry } from "@server/src/analyzerv2/Generic";
import FunctionNode from "@/components/code_colab/nodes/FunctionNode.vue";
import BlockNode from "@/components/code_colab/nodes/BlockNode.vue";
import UnknownNode from "@/components/code_colab/nodes/UnknownNode.vue";
import VariableNode from "@/components/code_colab/nodes/VariableNode.vue";
import LineNode from "@/components/code_colab/nodes/LineNode.vue";
import ExpressionNode from "@/components/code_colab/nodes/ExpressionNode.vue";
import FunctionParameterNode from "@/components/code_colab/nodes/FunctionParameterNode.vue";
import CallNode from "@/components/code_colab/nodes/CallNode.vue";
import LiteralNode from "@/components/code_colab/nodes/LiteralNode.vue";
import { VueConstructor } from "vue";

export function getComponentForKind(
  node: GenericNodeFrequencyEntry
): VueConstructor<Vue> | null {
  switch (node.kind) {
    case "FunctionNode":
      return FunctionNode;

    case "VariableNode":
      return VariableNode;

    case "UnknownNode":
      return UnknownNode;

    case "BlockNode":
      return BlockNode;

    case "LineNode":
      return LineNode;

    case "ExpressionNode":
      return ExpressionNode;

    case "FunctionParameterNode":
      return FunctionParameterNode;

    case "CallNode":
      return CallNode;

    case "LiteralNode":
      return LiteralNode;
  }

  return null;
}
