import type { ISlidingDoorService } from "./interfaces/slidingDoorService.interface";
import type {
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from "@/domain/models/slidingDoorConfig";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337/api";

// ── Shared fetch helper ───────────────────────────────────────────────────────
// Centralises error handling so every method doesn't repeat try/catch
const apiFetch = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status} ${response.statusText} — ${path}`
    );
  }

  return response.json() as Promise<T>;
};

// ── Real API service ──────────────────────────────────────────────────────────
export const slidingDoorApiService: ISlidingDoorService = {
  async getWardrobeTypes() {
    return apiFetch<WardrobeType[]>("/wardrobe-types");
  },

  async getWardrobeWidthRanges() {
    return apiFetch<WardrobeWidthRange[]>("/width-ranges");
  },

  async getWardrobeDoorMelamineColours() {
    return apiFetch<WardrobeDoorMelamineColour[]>("/melamine-colours");
  },

  async getWardrobeDoorInserts() {
    return apiFetch<WardrobeDoorInsert[]>("/door-inserts");
  },

  async getWardrobeStilesAndTracks() {
    return apiFetch<WardrobeStilesAndTracks[]>("/stiles-and-tracks");
  },

  async getWardrobeExtras() {
    return apiFetch<WardrobeExtra[]>("/extras");
  },
};