import { Node, ts } from 'ts-morph';
import { FrequencyEntry } from './FrequencyList';

export abstract class GenericNode {
  abstract kind: string;

  abstract count: number;

  abstract tryConsume(node: Node<ts.Node>): boolean;

  abstract getFrequencies(): { [key: string]: FrequencyEntry<any>[] };

  abstract getMostCommon(): any;

  abstract getSourceCode(indent: number): string;

  getIndentChars(indent: number) {
    return '\t'.repeat(indent);
  }
}
