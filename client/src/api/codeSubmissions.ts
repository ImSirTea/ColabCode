import { RoomJSON } from "@server/src/types";
import {
  GenericNode,
  GenericNodeFrequencyEntry,
} from "@server/src/analyzerv2/Generic";

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

export interface TempMostCommon {
  kind: string;
  lines: GenericNode[];
}

export async function getCodeFrequencies(
  roomId: string
): Promise<GenericNodeFrequencyEntry> {
  const response = await fetch(
    `http://127.0.0.1:8080/api/rooms/${roomId}/frequencies`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw Error(`Invalid response for room: ${roomId} ${response.status}`);
  }

  return (await response.json()) as GenericNodeFrequencyEntry;
}
