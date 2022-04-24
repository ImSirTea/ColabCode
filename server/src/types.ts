/**
 * JSON version of a code submission
 */
export interface CodeSubmissionJSON {
  userId: string;
  codeSrc: string;
}

/**
 * JSON version of a room
 */
export interface RoomJSON {
  [key: string]: CodeSubmissionJSON;
}
