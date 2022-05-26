import {
  Block,
  Node, SyntaxKind, SyntaxList, ts,
} from 'ts-morph';
import { ExpressionNode } from './Expression';
import { FrequencyEntry } from './FrequencyList';
import { FunctionNode } from './Function';
import { GenericNode, GenericNodeFrequencyEntry } from './Generic';
import { UnknownNode } from './Unknown';
import { VariableNode } from './Variable';

export class LineNode extends GenericNode {
  kind = 'LineNode';

  count = 0;

  possibilities: GenericNode[] = [
    new FunctionNode(),
    new VariableNode(),
    new ExpressionNode(),
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

  getAllFrequencies(): GenericNodeFrequencyEntry {
    return {
      kind: this.kind,
      frequency: this.count,
      properties: {
        line: this.possibilities.map((poss) => poss.getAllFrequencies()),
      },
    };
  }

  getMostCommon() {
    const frequencies = this.getFrequencies().kind;
    const mostFrequenct = frequencies.reduce((a, b) => (a.frequency > b.frequency ? a : b));
    // eslint-disable-next-line no-restricted-syntax
    for (const possibility of this.possibilities) {
      if (possibility.kind === mostFrequenct.value) {
        return possibility.getMostCommon();
      }
    }
    throw new Error('Most common does not exist');
  }

  getSourceCode(indent: number) {
    const frequencies = this.getFrequencies().kind;
    const mostFrequenct = frequencies.reduce((a, b) => (a.frequency > b.frequency ? a : b));
    // eslint-disable-next-line no-restricted-syntax
    for (const possibility of this.possibilities) {
      if (possibility.kind === mostFrequenct.value) {
        return `${this.getIndentChars(indent)}${possibility.getSourceCode(indent)};\n`;
      }
    }
    return '';
  }
}

export class BlockNode extends GenericNode {
  kind = 'BlockNode';

  count = 0;

  linePossibilities: LineNode[] = [];

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.SyntaxList) {
      this.count += 1;
      const typedNode = node as SyntaxList;
      typedNode.getChildren().forEach((child, i) => {
        this.addLinePossibility(i, child);
      });
      return true;
    }
    if (node.getKind() === SyntaxKind.Block) {
      this.count += 1;
      const typedNode = node as Block;
      typedNode.getStatements().forEach((child, i) => {
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

  getAllFrequencies(): GenericNodeFrequencyEntry {
    return {
      kind: this.kind,
      frequency: this.count,
      properties: {
        lines: this.linePossibilities.map((line) => line.getAllFrequencies()),
      },
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      lines: this.linePossibilities.map((line) => line.getMostCommon()),
    };
  }

  getSourceCode(indent: number): string {
    return this.linePossibilities
      .map((line) => line.getSourceCode(indent))
      .join('');
  }
}
