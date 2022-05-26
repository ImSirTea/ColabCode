import {
  LiteralExpression,
  Node, NumericLiteral, StringLiteral, SyntaxKind, ts, VariableStatement,
} from 'ts-morph';
import { FrequencyEntry, FrequencyList } from './FrequencyList';
import { FunctionNode } from './Function';
import { GenericNode } from './Generic';
import { UnknownNode } from './Unknown';

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
}

export class ExpressionNode extends GenericNode {
  kind = 'ExpressionNode';

  count = 0;

  possibilities = [
    new LiteralNode(),
    new FunctionNode(),
    new UnknownNode(),
  ];

  tryConsume(node: Node<ts.Node>) {
    const success = this.possibilities.some((possibility) => possibility.tryConsume(node));
    if (success) { this.count += 1; }
    return success;
  }

  getFrequencies() {
    return {
      kind: this.possibilities.map((possibility) => ({
        frequency: possibility.count,
        value: possibility.kind,
      })),
    };
  }

  getMostCommon() {
    const frequencies = this.getFrequencies().kind;
    const mostFrequenct = frequencies.reduce((a, b) => (a.frequency >= b.frequency ? a : b));
    // eslint-disable-next-line no-restricted-syntax
    for (const possibility of this.possibilities) {
      if (possibility.kind === mostFrequenct.value) {
        return possibility.getMostCommon();
      }
    }
    throw new Error('Most common does not exist');
  }
}

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
}
