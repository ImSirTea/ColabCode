import { CodeSubmission } from "./CodeSubmission";

export class Room {
  code: string;
  submissions: { [key: string]: CodeSubmission } = {};

  constructor(code: string) {
    this.code = code;
  }

  /**
   * Adds or updates the code for a user in this room
   * @param sessionId The session ID of the user
   * @param codeSrc The code they submitted
   */
  submitCode(sessionId: string, codeSrc: string) {
    if (this.submissions[sessionId]) {
      this.submissions[sessionId].codeSrc = codeSrc;
      return;
    }
    this.submissions[sessionId] = new CodeSubmission(sessionId, codeSrc);
  }
}