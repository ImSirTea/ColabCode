import {
  Node, SyntaxKind, SyntaxList, ts,
} from 'ts-morph';
import { FrequencyEntry } from './FrequencyList';
import { FunctionNode } from './Function';
import { GenericNode } from './Generic';
import { UnknownNode } from './Unknown';

export class LineNode extends GenericNode {
  kind = 'LineNode';

  count = 0;

  possibilities = [
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
}

export class BlockNode extends GenericNode {
  kind = 'BlockNode';

  count = 0;

  linePossibilities: LineNode[] = [];

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.SyntaxList) {
      const typedNode = node as SyntaxList;
      typedNode.getChildren().forEach((child, i) => {
        this.addLinePossibility(i, child);
      });
      return true;
    }
    return false;
  }

  addLinePossibility(line: number, node: Node<ts.Node>) {
    if (!this.linePossibilities[line]) {
      this.linePossibilities[line] = new LineNode();
    }
    this.linePossibilities[line].tryConsume(node);
  }

  getFrequencies() {
    const options: { [key: number]: FrequencyEntry<string>[] } = {};
    this.linePossibilities.forEach((possibility, i) => {
      const frequencies = possibility.getFrequencies().kind;
      options[i] = frequencies;
    });
    return options;
  }
}
