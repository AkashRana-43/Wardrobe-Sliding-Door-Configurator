import type { ISlidingDoorService } from "./interfaces/slidingDoorService.interface";
import {
  wardrobeTypes,
  wardrobeWidthRanges,
  wardrobeDoorMelamineColours,
  wardrobeDoorInserts,
  wardrobeStilesAndTracks,
  wardrobeExtras,
} from "./mock/slidingDoorMockData";

export const slidingDoorMockService: ISlidingDoorService = {
  async getWardrobeTypes() { return wardrobeTypes; },
  async getWardrobeWidthRanges() { return wardrobeWidthRanges; },
  async getWardrobeDoorMelamineColours() { return wardrobeDoorMelamineColours; },
  async getWardrobeDoorInserts() { return wardrobeDoorInserts; },
  async getWardrobeStilesAndTracks() { return wardrobeStilesAndTracks; },
  async getWardrobeExtras() { return wardrobeExtras; },
};