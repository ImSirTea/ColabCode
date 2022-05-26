import { Node, ts } from 'ts-morph';
import { CallNode } from './Call';
import { FunctionNode } from './Function';
import { GenericNode } from './Generic';
import { IdentifierNode } from './Identifier';
import { LiteralNode } from './Literal';
import { UnknownNode } from './Unknown';

export class ExpressionNode extends GenericNode {
  kind = 'ExpressionNode';

  count = 0;

  possibilities: GenericNode[] = [
    new LiteralNode(),
    new IdentifierNode(),
    new FunctionNode(),
    new CallNode(),
    new UnknownNode(),
  ];

  tryConsume(node: Node<ts.Node>) {
    const success = this.possibilities.some((possibility) => possibility.tryConsume(node));
    if (success) { this.count += 1; } else { console.log(node); }
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
