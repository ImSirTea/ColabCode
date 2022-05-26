/* eslint-disable class-methods-use-this */
import {
  ArrowFunction,
  FunctionDeclaration, Node, ParameterDeclaration, SyntaxKind, ts,
} from 'ts-morph';
import { BlockNode } from './Block';
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
        // console.log(init);
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

  asyncPossibilities = new FrequencyList<boolean>();

  arrowPossibilities = new FrequencyList<boolean>();

  parameterPossibilities: FunctionParameterNode[] = [];

  blockPossibilities = new BlockNode();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.FunctionDeclaration) {
      this.count += 1;
      const typedNode = (node as FunctionDeclaration);
      this.namePossibilities.add(typedNode.getName() ?? '');
      this.asyncPossibilities.add(typedNode.getAsyncKeyword() !== undefined);
      this.arrowPossibilities.add(false);
      typedNode.getParameters().forEach((parameter, i) => {
        if (!this.parameterPossibilities[i]) {
          this.parameterPossibilities[i] = new FunctionParameterNode();
        }
        this.parameterPossibilities[i].tryConsume(parameter);
      });
      const body = typedNode.getBody();
      if (body) {
        this.blockPossibilities.tryConsume(body);
      }
      return true;
    }
    if (node.getKind() === SyntaxKind.ArrowFunction) {
      this.count += 1;
      const typedNode = (node as ArrowFunction);
      const parent = typedNode.getParentIfKind(SyntaxKind.VariableDeclaration);
      if (parent) {
        this.namePossibilities.add(parent.getName());
      }
      this.asyncPossibilities.add(typedNode.getAsyncKeyword() !== undefined);
      this.arrowPossibilities.add(true);
      typedNode.getParameters().forEach((parameter, i) => {
        if (!this.parameterPossibilities[i]) {
          this.parameterPossibilities[i] = new FunctionParameterNode();
        }
        this.parameterPossibilities[i].tryConsume(parameter);
      });
      const body = typedNode.getBody();
      if (body) {
        this.blockPossibilities.tryConsume(body);
      }
      return true;
    }
    return false;
  }

  getFrequencies() {
    return {
      name: this.namePossibilities.all,
      async: this.asyncPossibilities.all,
      arrow: this.arrowPossibilities.all,
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
      async: this.asyncPossibilities.mostCommon.value,
      arrow: this.asyncPossibilities.mostCommon.value,
      parameters: this.parameterPossibilities.map((param) => {
        // If >=50% of functions have this parameter, include it
        if (param.count >= (this.count / 2)) {
          return param.getMostCommon();
        }
        return undefined;
      }),
      body: this.blockPossibilities.getMostCommon(),
    };
  }
}
