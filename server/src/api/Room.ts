import { RoomJSON } from '@/types';
import CodeSubmission from '@/api/CodeSubmission';

/**
 * Represents a room to hold code submissions
 */
class Room {
  #code: string;

  #submissions: { [key: string]: CodeSubmission } = {};

  /**
   * Creates a room
   * @param code The room code
   */
  constructor(code: string) {
    this.#code = code;
  }

  /**
   * Returns the room code
   */
  get code() {
    return this.#code;
  }

  /**
   * Returns an object with all submissions to this room
   */
  get submissions() {
    return this.#submissions;
  }

  /**
   * Adds or updates the code for a user in this room
   * @param sessionId The session ID of the user
   * @param codeSrc The code they submitted
   */
  submitCode(sessionId: string, codeSrc: string) {
    if (this.#submissions[sessionId]) {
      this.#submissions[sessionId].codeSrc = codeSrc;
      return;
    }
    this.#submissions[sessionId] = new CodeSubmission(sessionId, codeSrc);
  }

  /**
   * Returns a JSON-returnable version of this room
   */
  get json() {
    const output: RoomJSON = {};
    const keys = Object.keys(this.submissions);
    keys.forEach((key) => {
      output[key] = this.submissions[key].json;
    });
    return output;
  }
}

export default Room;
