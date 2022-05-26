import { RoomJSON } from "../../../server/src/types";

export async function getAllCodeSubmissions(roomId: string): Promise<string[]> {
  const response = await fetch(
    `http://127.0.0.1:8080/api/rooms/${roomId}/submissions`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw Error(`Invalid response for room: ${roomId} ${response.status}`);
  }

  const submissions = (await response.json()) as RoomJSON;
  return Object.values(submissions).map((userCodePair) => userCodePair.codeSrc);
}
