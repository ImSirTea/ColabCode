export interface FrequencyEntry<T> {
  frequency: number;
  value: T;
}

export class FrequencyList<T> {
  frequencies: {
    [key: string]: FrequencyEntry<T>
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

  get all() {
    return Object.values(this.frequencies).sort((a, b) => b.frequency - a.frequency);
  }
}
