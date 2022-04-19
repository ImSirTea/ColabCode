export class CodeSubmission {
  #sessionId: string;
  #codeSrc: string;

  constructor(sessionId: string, code?: string) {
    this.#sessionId = sessionId;
    if (code) {
      this.codeSrc = code;
    }
  }

  set codeSrc(src: string) {
    this.#codeSrc = src;
  }

  get codeSrc() {
    return this.#codeSrc;
  }

  get sessionId() {
    return this.#sessionId;
  }
}