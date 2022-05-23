/* eslint-disable class-methods-use-this */
import {
  FunctionDeclaration, Node, ParameterDeclaration, SyntaxKind, ts,
} from 'ts-morph';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class FunctionParameterNode extends GenericNode {
  kind = 'FunctionParameterNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  initialPossibilities = new FrequencyList<any>();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.Parameter) {
      this.count += 1;
      const typedNode = (node as ParameterDeclaration);
      this.namePossibilities.add(typedNode.getName() ?? '');
      const init = typedNode.getInitializer();
      if (init) {
        console.log(init);
      }
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
      name: this.namePossibilities.mostCommon.value,
    };
  }
}

export class FunctionNode extends GenericNode {
  kind = 'FunctionNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  parameterPossibilities: FunctionParameterNode[] = [];

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.FunctionDeclaration) {
      this.count += 1;
      const typedNode = (node as FunctionDeclaration);
      this.namePossibilities.add(typedNode.getName() ?? '');
      typedNode.getParameters().forEach((parameter, i) => {
        if (!this.parameterPossibilities[i]) {
          this.parameterPossibilities[i] = new FunctionParameterNode();
        }
        this.parameterPossibilities[i].tryConsume(parameter);
      });
      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      name: this.namePossibilities.all,
      parameter: this.parameterPossibilities.map((param) => ({
        frequency: param.count,
        value: param.getFrequencies(),
      })),
    };
  }

  getMostCommon() {
    return {
      kind: this.kind,
      name: this.namePossibilities.mostCommon.value,
      parameters: this.parameterPossibilities.map((param) => param.getMostCommon()),
    };
  }
}
