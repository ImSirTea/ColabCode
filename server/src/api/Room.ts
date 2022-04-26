import util from 'util';
import { RoomJSON } from '@/types';
import CodeSubmission from '@/api/CodeSubmission';
import { Line } from '@/analizer/Line';

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
   * Returns a list of all the submissions
   */
  get submissionsList() {
    return Object.values(this.submissions);
  }

  /**
   * Adds a user to a room
   * @param userId The user's id
   * @returns Success state of adding a new user
   */
  addUser(userId: string): boolean {
    // If the user exists, error
    if (this.#submissions[userId]) {
      return false;
    }

    this.#submissions[userId] = new CodeSubmission(userId, '');
    return true;
  }

  /**
   * Adds or updates the code for a user in this room
   * @param userId The user ID
   * @param codeSrc The code they submitted
   * @returns Success state of updating
   */
  submitCode(userId: string, codeSrc: string): boolean {
    // If the user doesn't exist, they should join first
    if (!this.#submissions[userId]) {
      return false;
    }

    this.#submissions[userId] = new CodeSubmission(userId, codeSrc);

    this.updateAverageSolution();

    return true;
  }

  /**
   * Returns a JSON-returnable version of this room
   */
  get json() {
    const output: RoomJSON = {};
    const keys = Object.keys(this.submissions);
    keys.forEach((key) => {
      const submissionJson = this.submissions[key].json;

      if (submissionJson.codeSrc) {
        output[key] = this.submissions[key].json;
      }
    });
    return output;
  }

  /**
   * Updates the average code solution for the class
   */
  updateAverageSolution() {
    console.log('Updating average');

    const line = new Line();
    this.submissionsList.forEach((submission) => {
      line.tryConsume(submission.codeAST?.body[0]);
    });
    console.log(util.inspect(line.mostCommon, false, null, true));
  }
}

export default Room;
