import { BranchDefinition, FrequencyList } from './helper';

/**
 * Interface for building a function parameter
 */
export interface FunctionParameterDefinition {
  name: string;
  default?: any;
}

/**
 * Represents a parameter of a function
 */
export class FunctionParameter extends BranchDefinition<FunctionParameterDefinition> {
  nameFrequencies = new FrequencyList<string>();

  defaultFrequencies = new FrequencyList<any>();

  totalCount = 0;

  /**
   * Adds a parameter possibility
   */
  addPossibility(definition: FunctionParameterDefinition) {
    this.nameFrequencies.add(definition.name);
    this.defaultFrequencies.add(definition.default, `${typeof definition.default}:${definition.default}`);
    this.totalCount += 1;
  }

  /**
   * Returns the most common values for each property
   */
  get mostCommon() {
    const { mostCommon } = this.nameFrequencies;
    if (mostCommon.frequency > this.totalCount - this.nameFrequencies.total) {
      return {
        name: this.nameFrequencies.mostCommon.value,
        default: this.defaultFrequencies.mostCommon.value,
      };
    }
    return {
      name: '',
      default: undefined,
    };
  }

  tryConsume(branch: any): boolean {
    if (!branch) { return false; }
    if (branch.type === 'Identifier') {
      this.addPossibility({ name: branch.name, default: undefined });
      return true;
    }
    if (branch.type === 'AssignmentPattern') {
      this.addPossibility({ name: branch.left.name, default: branch.right.value });
      return true;
    }
    return false;
  }
}

/**
 * Interface for building a function
 */
export interface FunctionDefinition {
  name: string;
  parameters: FunctionParameterDefinition[];
}

/**
 * Represents a function
 */
export class Function extends BranchDefinition<FunctionDefinition > {
  nameFrequencies = new FrequencyList<string>();

  parameters: FunctionParameter[] = [];

  methodFrequencies = new FrequencyList<string>();

  /**
   * Adds a possibility for this function
   */
  addPossibility(definition: FunctionDefinition) {
    this.nameFrequencies.add(definition.name);
    definition.parameters.forEach((parameter, i) => {
      if (!this.parameters[i]) {
        this.parameters.push(new FunctionParameter());
      }
      this.parameters[i].addPossibility(parameter);
    });
  }

  /**
   * Returns the most common values for each property
   */
  get mostCommon() {
    const { total } = this.nameFrequencies;
    // eslint-disable-next-line no-param-reassign
    this.parameters.forEach((param) => { param.totalCount = total; });
    return {
      name: this.nameFrequencies.mostCommon.value,
      parameters: this.parameters.map((param) => param.mostCommon),
    };
  }

  tryConsume(branch: any): boolean {
    if (!branch) { return false; }
    if (branch.type === 'FunctionDeclaration') {
      // It's definitely a function, consume it.
      const { name } = branch.id;
      this.addPossibility({ name, parameters: [] });
      branch.params.forEach((param: any, i: number) => {
        if (!this.parameters[i]) { this.parameters.push(new FunctionParameter()); }
        this.parameters[i].tryConsume(param);
      });
      return true;
    }
    if (branch.type === 'VariableDeclaration') {
      // Check if it's an arrow function being assigned to a variable
      if (branch.declarations[0] && branch.declarations[0].init.type === 'ArrowFunctionExpression') {
        const func = branch.declarations[0].init;
        this.addPossibility({ name: branch.declarations[0].name, parameters: [] });
        func.params.forEach((param: any, i: number) => {
          if (!this.parameters[i]) { this.parameters.push(new FunctionParameter()); }
          this.parameters[i].tryConsume(param);
        });
        return true;
      }
    }
    return false;
  }
}
