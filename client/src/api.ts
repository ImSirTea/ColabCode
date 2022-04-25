import fetch from "node-fetch";

/**
 * Joins a room, getting a user id from the server
 * @param roomCode Room code to join
 */
 export async function joinRoom(roomCode: string): Promise<string> {
  const response = await fetch(`http://127.0.0.1:8080/api/rooms/${roomCode}/join`,
  {
    method: "POST",
  });

  const userId = await response.text();

  return userId;
}

/**
 * Sends a code submission to a given room
 * @param roomCode Room code to post changes to
 * @param code The code snippet to update
 */
export async function sendCodeSubmission(roomCode: string, code: string, userId: string): Promise<void> {
  fetch(
    `http://127.0.0.1:8080/api/rooms/${roomCode}/${userId}/submit`, 
    { 
      method: "POST", 
      body: JSON.stringify(code),
    }
  );
}