import { parse } from 'abstract-syntax-tree';
import util from 'util';
import { CodeSubmissionJSON } from '@/types';

/**
 * Represents a code submission from a user
 */
class CodeSubmission {
  #sessionId: string;

  #codeSrc: string;

  #codeAST: any;

  /**
   * Creates a new code submission
   * @param sessionId The session ID of the user
   * @param codeSrc The code they submitted
   */
  constructor(sessionId: string, codeSrc?: string) {
    this.#sessionId = sessionId;
    if (codeSrc) {
      this.codeSrc = codeSrc;
    }
  }

  /**
   * Sets the user's submitted code
   */
  set codeSrc(src: string) {
    this.#codeSrc = src;
    this.updateAST();
  }

  /**
   * Returns the user's submitted code
   */
  get codeSrc() {
    return this.#codeSrc;
  }

  /**
   * Returns the user's session ID
   */
  get sessionId() {
    return this.#sessionId;
  }

  /**
   * Returns a JSON-returnable version of this submission
   */
  get json(): CodeSubmissionJSON {
    return {
      userId: this.sessionId,
      codeSrc: this.codeSrc,
    };
  }

  /**
   * Updates the AST internally
   */
  private updateAST() {
    console.log(`Updating AST of ${this.sessionId}`);

    this.#codeAST = parse(this.codeSrc);
    console.log(util.inspect(this.#codeAST, false, null, true));
  }

  /**
   * Returns the Abstract Syntax Tree for this user's code
   */
  get codeAST() {
    return this.#codeAST;
  }
}

export default CodeSubmission;
