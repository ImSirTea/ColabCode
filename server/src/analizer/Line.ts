// eslint-disable-next-line import/no-cycle
import { Function, FunctionDefinition } from './Function';
import { BranchDefinition, FrequencyList } from './helper';
import { Variable, VariableDefinition } from './Variable';

const LineTypes = ['Function', 'Variable', 'Blank'] as const;
type LineType = typeof LineTypes[number];

export interface LineDefinition {
  type: LineType;
  definition: FunctionDefinition | VariableDefinition | undefined;
}

/**
 * Represents a line/block of code
 */
export class Line extends BranchDefinition<LineDefinition> {
  typeFrequencies = new FrequencyList<LineType>();

  functionDefinition = new Function();

  variableDefinition = new Variable();

  /**
   * Adds a possibility to this line
   */
  addPossibility(definition: LineDefinition): void {
    this.typeFrequencies.add(definition.type);
    switch (definition.type) {
      case ('Function'): {
        this.functionDefinition.addPossibility(definition.definition as FunctionDefinition);
        break;
      } case ('Variable'): {
        this.variableDefinition.addPossibility(definition.definition as VariableDefinition);
        break;
      } default: {
        throw new Error('Should never reach this...');
      }
    }
  }

  /**
   * Gets the most common possibility for this line
   */
  get mostCommon() {
    const typeName = (this.typeFrequencies.total === 0)
      ? 'Blank'
      : this.typeFrequencies.mostCommon.value;
    let definition;
    switch (typeName) {
      case ('Function'): {
        definition = this.functionDefinition.mostCommon;
        break;
      } case ('Variable'): {
        definition = this.variableDefinition.mostCommon;
        break;
      } case ('Blank'): {
        definition = undefined;
        break;
      } default: {
        throw new Error('Should never reach this...');
      }
    }
    return {
      type: typeName,
      definition,
    };
  }

  tryConsume(branch: any): boolean {
    if (this.functionDefinition.tryConsume(branch)) {
      this.typeFrequencies.add('Function');
      return true;
    }
    if (this.variableDefinition.tryConsume(branch)) {
      this.typeFrequencies.add('Variable');
      return true;
    }
    return false;
  }
}
