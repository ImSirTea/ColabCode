import {
  Node, SyntaxKind, CallExpression, ts,
} from 'ts-morph';
import { FrequencyList } from './FrequencyList';
import { GenericNode, GenericNodeFrequencyEntry } from './Generic';
import { ExpressionNode } from './Expression';

export class CallNode extends GenericNode {
  kind = 'CallNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  argumentPossibilities: ExpressionNode[] = [];

  tryConsume(node: Node<ts.Node>): boolean {
    if (node.getKind() === SyntaxKind.ExpressionStatement) {
      const callExp = node.getFirstChildByKind(SyntaxKind.CallExpression);
      if (callExp) {
        return this.tryConsume(callExp);
      }
    }
    if (node.getKind() === SyntaxKind.CallExpression) {
      this.count += 1;
      const typedNode = (node as CallExpression);
      this.namePossibilities.add(typedNode.getExpression().getText());
      typedNode.getArguments().forEach((argument, i) => {
        if (!this.argumentPossibilities[i]) {
          this.argumentPossibilities[i] = new ExpressionNode();
        }
        this.argumentPossibilities[i].tryConsume(argument);
      });

      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      name: this.namePossibilities.all,
    };
  }

  getAllFrequencies(): GenericNodeFrequencyEntry {
    return {
      kind: this.kind,
      frequency: this.count,
      properties: {
        name: this.namePossibilities.all,
        arguments: this.argumentPossibilities.map((arg) => arg.getAllFrequencies()),
      },
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      name: this.namePossibilities.mostCommon.value,
      arguments: this.argumentPossibilities.map((argument) => {
        if (argument.count >= (this.count / 2)) {
          return argument.getMostCommon();
        }
        return undefined;
      }),
    };
  }

  getSourceCode(indent: number): string {
    let code = `${this.namePossibilities.mostCommon.value}`;
    code += '(';
    code += this.argumentPossibilities.map((argument) => argument.getSourceCode(indent)).join(', ');
    code += ')';
    return code;
  }
}
