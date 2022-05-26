import {
  Node, SyntaxKind, ts, Identifier,
} from 'ts-morph';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class IdentifierNode extends GenericNode {
  kind = 'IdentifierNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  tryConsume(node: Node<ts.Node>): boolean {
    if (node.getKind() === SyntaxKind.Identifier) {
      this.count += 1;

      const typedNode = (node as Identifier);
      this.namePossibilities.add(typedNode.getText());
      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      name: this.namePossibilities.all,
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      name: this.namePossibilities.mostCommon.value,
    };
  }

  getSourceCode(_indent: number): string {
    return `${this.namePossibilities.mostCommon.value}`;
  }
}
