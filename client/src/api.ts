import fetch from "node-fetch";

/**
 * Sends a code submission to a given room
 * @param roomId Room key to post changes to
 * @param code The code snippet to update
 */
export async function sendCodeSubmission(roomId: string, code: string) {
  fetch(
    `http://127.0.0.1:8080/api/rooms/${roomId}/submissions`, 
    { 
      method: "POST", 
      body: JSON.stringify(code) 
    }
  );
}