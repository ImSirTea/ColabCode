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

export type ASTBranch = any;
export interface ASTBranchGroup {
  type: string;
  amount: number;
  branches: ASTBranch[];
}
export interface ASTBranchFrequencies {
  [key: string]: ASTBranchGroup;
}
