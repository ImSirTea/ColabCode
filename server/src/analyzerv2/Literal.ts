import {
  LiteralExpression, Node, NumericLiteral, StringLiteral, SyntaxKind, ts,
} from 'ts-morph';
import { FrequencyEntry, FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class LiteralNode extends GenericNode {
  kind = 'LiteralNode';

  count = 0;

  valuePossibilities = new FrequencyList<string | number>();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const typedNode = (node as StringLiteral);
      this.valuePossibilities.add(typedNode.getLiteralValue());
      return true;
    }
    if (node.getKind() === SyntaxKind.NumericLiteral) {
      const typedNode = (node as NumericLiteral);
      this.valuePossibilities.add(typedNode.getLiteralValue());
      return true;
    }
    if (node.getKind() === SyntaxKind.LiteralType) {
      const typedNode = (node as LiteralExpression);
      this.valuePossibilities.add(typedNode.getLiteralText());
      return true;
    }

    return false;
  }

  getFrequencies(): { [key: string]: FrequencyEntry<any>[]; } {
    return {
      value: this.valuePossibilities.all,
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      value: this.valuePossibilities.mostCommon.value,
    };
  }

  getSourceCode(_indent: number): string {
    const mostCommon = this.valuePossibilities.mostCommon.value;
    if (typeof mostCommon === 'number') {
      return `${mostCommon}`;
    }
    return `'${mostCommon}'`;
  }
}
