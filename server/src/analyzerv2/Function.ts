/* eslint-disable class-methods-use-this */
import {
  ArrowFunction,
  FunctionDeclaration, Node, ParameterDeclaration, SyntaxKind, ts,
} from 'ts-morph';
import { BlockNode } from './Block';
import { ExpressionNode } from './Expression';
import { FrequencyList } from './FrequencyList';
import { GenericNode } from './Generic';

export class FunctionParameterNode extends GenericNode {
  kind = 'FunctionParameterNode';

  count = 0;

  namePossibilities = new FrequencyList<string>();

  initialPossibilities = new ExpressionNode();

  tryConsume(node: Node<ts.Node>) {
    if (node.getKind() === SyntaxKind.Parameter) {
      this.count += 1;
      const typedNode = (node as ParameterDeclaration);
      this.namePossibilities.add(typedNode.getName() ?? '');
      const init = typedNode.getInitializer();
      if (init) {
        this.initialPossibilities.tryConsume(init);
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

  getSourceCode(_indent: number): string {
    let code = `${this.namePossibilities.mostCommon.value}`;
    if (this.initialPossibilities.count >= (this.count / 2)) {
      code += ` = ${this.initialPossibilities.getSourceCode(_indent)}`;
    }
    return code;
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

  getSourceCode(indent: number): string {
    let code = (this.asyncPossibilities.mostCommon.value)
      ? 'async '
      : '';
    const isArrow = this.arrowPossibilities.mostCommon.value;
    if (!isArrow) {
      code += `function ${this.namePossibilities.mostCommon.value}`;
    }
    code += '(';
    code += this.parameterPossibilities.map((param) => param.getSourceCode(indent)).join(', ');
    code += ')';
    if (isArrow) { code += ' => '; }
    code += '{\n';
    code += this.blockPossibilities.getSourceCode(indent + 1);
    code += '}';
    return code;
  }
}
