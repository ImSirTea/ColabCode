import { Router } from 'express';
import Room from '@/api/Room';

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
 * METHOD: POST
 * ROUTE: /rooms/:roomId/submissions
 * Submits code to a room.
 * Uses the session ID to identify the user
 */
api.post('/rooms/:roomId/submissions', (request, response) => {
  const roomCode = request.params.roomId;
  const room = getOrCreateRoom(roomCode);
  const sessionId = request.sessionID;
  const code = request.body;
  room.submitCode(sessionId, code);
  response.sendStatus(204);
});

/**
 * METHOD: GET
 * ROUTE: /rooms/:roomId/submissions
 * Returns a list of all submissions to a room
 */
api.get('/rooms/:roomId/submissions', (request, response) => {
  const roomCode = request.params.roomId;
  const room = rooms[roomCode];
  if (!room) { response.status(404).send('Room not found'); return; }
  const submissions = room.json;
  response.send(submissions);
});

export default api;
