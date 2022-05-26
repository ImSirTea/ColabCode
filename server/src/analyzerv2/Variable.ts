import {
  Node, SyntaxKind, ts, VariableStatement,
} from 'ts-morph';
import { ExpressionNode } from './Expression';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

const VariableTypes = ['var', 'let', 'const'] as const;
type VariableType = typeof VariableTypes[number];

export class VariableNode extends GenericNode {
  kind = 'VariableNode';

  count = 0;

  subkindPossibilities = new FrequencyList<VariableType>();

  namePossibilities = new FrequencyList<string>();

  valuePossibilities = new ExpressionNode();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.VariableStatement) {
      this.count += 1;
      const typedNode = (node as VariableStatement);
      this.subkindPossibilities.add(typedNode.getDeclarationKind());
      this.namePossibilities.add(typedNode.getDeclarations()[0].getName());
      const value = typedNode.getDeclarations()[0].getInitializer();
      if (value) {
        this.valuePossibilities.tryConsume(value);
      }
      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      subkind: this.subkindPossibilities.all,
      name: this.namePossibilities.all,
      value: this.valuePossibilities.getFrequencies().kind,
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      subkind: this.subkindPossibilities.mostCommon.value,
      name: this.namePossibilities.mostCommon.value,
      value: this.valuePossibilities.getMostCommon(),
    };
  }

  getSourceCode(indent: number): string {
    let code = `${this.subkindPossibilities.mostCommon.value} `;
    code += `${this.namePossibilities.mostCommon.value} = `;
    code += `${this.valuePossibilities.getSourceCode(indent)}`;
    return code;
  }
}
