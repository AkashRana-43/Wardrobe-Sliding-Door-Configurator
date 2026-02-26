import type { ISlidingDoorService } from "@/services/interfaces/slidingDoorService.interface";
import {
  wardrobeTypes,
  wardrobeWidthRanges,
  wardrobeDoorMelamineColours,
  wardrobeDoorInserts,
  wardrobeStilesAndTracks,
  wardrobeExtras,
} from "@/services/mock/slidingDoorMockData";

export const slidingDoorService: ISlidingDoorService = {
  async getWardrobeTypes() { return wardrobeTypes; },
  async getWardrobeWidthRanges() { return wardrobeWidthRanges; },
  async getWardrobeDoorMelamineColours() { return wardrobeDoorMelamineColours; },
  async getWardrobeDoorInserts() { return wardrobeDoorInserts; },
  async getWardrobeStilesAndTracks() { return wardrobeStilesAndTracks; },
  async getWardrobeExtras() { return wardrobeExtras; },
};