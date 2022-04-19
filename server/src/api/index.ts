import { Router } from "express";
import { Room } from "./room";

// Create the API router
const api = Router();

// Store an object of all the rooms
const rooms: { [key: string]: Room } = {};

/**
 * Gets a room by ID, creating it if not exists
 * @param id The id of the room
 * @returns The room
 */
function getOrCreateRoom(id: string) {
  if (rooms[id]) { return rooms[id]; }
  rooms[id] = new Room(id);
  return rooms[id];
}

/**
 * METHOD: Post
 * ROUTE: /:roomId
 * Submits code to a room.
 * Uses the session ID to identify the user
 */
api.post("/rooms/:roomId/code", (request, response) => {
  const roomCode = request.params.roomId;
  const room = getOrCreateRoom(roomCode);
  const sessionId = request.sessionID;
  const code = request.body;
  room.submitCode(sessionId, code);
  response.sendStatus(204);
});

export default api;