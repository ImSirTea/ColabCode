import { Node, ts } from 'ts-morph';
import { GenericNode } from './Generic';

export class UnknownNode extends GenericNode {
  kind = 'UnknownNode';

  count = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tryConsume(_node: Node<ts.Node>): boolean {
    this.count += 1;
    return true;
  }

  getFrequencies() {
    return {};
  }
}
