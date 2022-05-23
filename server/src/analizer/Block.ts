import { BranchDefinition } from './helper';
// eslint-disable-next-line import/no-cycle
import { Line, LineDefinition } from './Line';

export type BlockDefinition = LineDefinition[];

export class Block extends BranchDefinition<LineDefinition[]> {
  lines: Line[] = [];

  addPossibility(definition: LineDefinition[]): void {
    definition.forEach((line, i) => {
      if (!this.lines[i]) { this.lines[i] = new Line(); }
      this.lines[i].addPossibility(line);
    });
  }

  get mostCommon(): LineDefinition[] {
    return this.lines.map((line) => line.mostCommon);
  }

  tryConsume(branch: any) {
    if (!branch) { return false; }
    if (branch.type !== 'BlockStatement') { return false; }
    console.log('----------------------------------------------------------------');

    (branch.body as any[]).forEach((subranch, i) => {
      if (!this.lines[i]) { this.lines[i] = new Line(); }
      console.log(this.lines[i].tryConsume(subranch));
    });
    return true;
  }
}
