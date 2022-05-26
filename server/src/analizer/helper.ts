export class FrequencyList<T> {
  frequencies: {
    [key: string]: {
      frequency: number;
      value: T;
    }
  } = {};

  /**
   * Adds a value to the frequency list
   * @param value The value to add
   * @param name The name of the value, if toString produces something non-unique
   */
  add(value: T, name?: string) {
    const key = name ?? (`${value}`);
    if (!this.frequencies[key]) {
      this.frequencies[key] = {
        frequency: 0,
        value,
      };
    }
    this.frequencies[key].frequency += 1;
  }

  /**
   * Gets the most common value from the list
   */
  get mostCommon() {
    const key = Object.keys(this.frequencies)
      .reduce((a, b) => (this.frequencies[a].frequency > this.frequencies[b].frequency ? a : b));
    return this.frequencies[key];
  }

  get total() {
    return Object.keys(this.frequencies)
      .reduce((acc, key) => acc + this.frequencies[key].frequency, 0);
  }
}

export abstract class BranchDefinition<T> {
  /**
   * Adds a possibility to this definition
   * @param definition The object dinfining the possibility
   */
  abstract addPossibility(definition: T): void;

  /**
   * Returns the most common possibility for this branch
   */
  abstract get mostCommon(): T;

  /**
   * Attempts to consume the AST branch. Returns true if successful.
   * @param branch The AST branch to consume
   */
  abstract tryConsume(branch: any): boolean;
}
