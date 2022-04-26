/* eslint-disable class-methods-use-this */
import {
  FunctionDeclaration, Node, SyntaxKind, ts,
} from 'ts-morph';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class FunctionNode extends GenericNode {
  kind = 'FunctionNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.FunctionDeclaration) {
      this.count += 1;
      const functionName = (node as FunctionDeclaration).getName();
      this.namePossibilities.add(functionName ?? '');
      console.log(`Added ${functionName}`);
      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      name: this.namePossibilities.all,
    };
  }
}
