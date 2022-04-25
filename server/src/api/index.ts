import { Router } from 'express';
import Room from '@/api/Room';
import { v4 as uuidv4 } from 'uuid';

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
 * ROUTE: /rooms/:roomId/join
 * Joins a room
 */
api.post('/rooms/:roomId/join', (request, response) => {
  const roomCode = request.params.roomId;
  const room = getOrCreateRoom(roomCode);
  const userId = uuidv4();
  const userAdded = room.addUser(userId);

  // If we can't add the user, they probably already exist
  if (!userAdded) {
    response.status(400).send('User already exists');
  }

  response.send(userId);
});

/**
 * METHOD: POST
 * ROUTE: /rooms/:roomId/:userId/submissions
 * Submits code to a room.
 * Uses the ID provided by join
 */
api.post('/rooms/:roomId/:userId/submit', (request, response) => {
  const { roomId, userId } = request.params;
  const room = rooms[roomId];

  // You should have to join, so the room should exist anyway
  if (!room) {
    response.status(404).send('Room does not exist');
  }

  const code = request.body;
  const codeSubmitted = room.submitCode(userId, code);

  // If we failed to submit the code, the user probably wasn't in the room
  if (!codeSubmitted) {
    response.status(400).send('User does not exist in the room');
  }

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
