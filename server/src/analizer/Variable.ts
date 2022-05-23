import { BranchDefinition, FrequencyList, parseValue } from './helper';

const VariableTypes = ['const', 'let', 'var', 'assign'] as const;
type VariableType = typeof VariableTypes[number];

export interface VariableDefinition {
  name: string;
  type: VariableType;
  value?: any;
}

export class Variable extends BranchDefinition<VariableDefinition> {
  nameFrequencies = new FrequencyList<string>();

  typeFrequencies = new FrequencyList<VariableType>();

  valueFrequencies = new FrequencyList<any>();

  /**
   * Adds a variable possibility
   */
  addPossibility(definition: VariableDefinition) {
    this.nameFrequencies.add(definition.name);
    this.typeFrequencies.add(definition.type);
    this.valueFrequencies.add(definition.value);
  }

  get mostCommon(): VariableDefinition {
    return {
      name: this.nameFrequencies.mostCommon.value,
      type: this.typeFrequencies.mostCommon.value,
      value: this.valueFrequencies.mostCommon.value,
    };
  }

  tryConsume(branch: any): boolean {
    if (!branch) { return false; }
    if (branch.type === 'VariableDeclaration') {
      this.addPossibility({
        name: branch.declarations[0].id.name,
        type: branch.kind,
        value: parseValue(branch.declarations[0].init),
      });
      return true;
    }
    if (branch.type === 'ExpressionStatement') {
      if (branch.expression.type === 'AssignmentExpression' && branch.expression.operator === '=') {
        this.addPossibility({
          name: branch.expression.left.name,
          type: 'assign',
          value: parseValue(branch.expression.right),
        });
        return true;
      }
    }
    return false;
  }
}
