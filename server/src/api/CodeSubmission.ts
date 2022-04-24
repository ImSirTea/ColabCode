import { CodeSubmissionJSON } from '@/types';

/**
 * Represents a code submission from a user
 */
class CodeSubmission {
  #sessionId: string;

  #codeSrc: string;

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
}

export default CodeSubmission;
