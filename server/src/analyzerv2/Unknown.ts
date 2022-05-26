import { Node, ts } from 'ts-morph';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class UnknownNode extends GenericNode {
  kind = 'UnknownNode';

  count = 0;

  textPossibilities = new FrequencyList<string>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tryConsume(_node: Node<ts.Node>): boolean {
    this.count += 1;
    this.textPossibilities.add(_node.getText());
    console.log(_node.getKind());
    return true;
  }

  getFrequencies() {
    return {
      text: this.textPossibilities.all,
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      text: this.textPossibilities.mostCommon.value,
    };
  }
}
