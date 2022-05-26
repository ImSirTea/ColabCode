import { Function, FunctionDefinition } from './Function';
import { BranchDefinition, FrequencyList } from './helper';

const LineTypes = ['Function', 'Variable'] as const;
type LineType = typeof LineTypes[number];

export type LineDefinition = {
  type: 'Function',
  definition: FunctionDefinition,
} | {
  type: 'Variable',
  definition: FunctionDefinition,
};

/**
 * Represents a line/block of code
 */
export class Line extends BranchDefinition<LineDefinition> {
  typeFrequencies = new FrequencyList<LineType>();

  functionDefinition = new Function();

  /**
   * Adds a possibility to this line
   */
  addPossibility(definition: LineDefinition): void {
    this.typeFrequencies.add(definition.type);
    switch (definition.type) {
      case ('Function'): {
        this.functionDefinition.addPossibility(definition.definition);
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
    const typeName = this.typeFrequencies.mostCommon.value;
    let definition;
    switch (typeName) {
      case ('Function'): {
        definition = this.functionDefinition.mostCommon;
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
    const success = this.functionDefinition.tryConsume(branch);
    if (success) {
      this.typeFrequencies.add('Function');
    }
    return success;
  }
}
