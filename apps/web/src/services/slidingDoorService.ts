import type { ISlidingDoorService } from "@/services/interfaces/slidingDoorService.interface";
import {
  wardrobeTypes,
  wardrobeWidthRanges,
  wardrobeDoorStyles,
  wardrobeDoorMelamineColours,
  wardrobeDoorMultiPanelOptions,
  wardrobeDoorInserts,
  wardrobeStilesAndTracks,
  wardrobeExtras,
} from "@/services/mock/slidingDoorMockData";

export const slidingDoorService: ISlidingDoorService = {
  async getWardrobeTypes() { return wardrobeTypes; },
  async getWardrobeWidthRanges() { return wardrobeWidthRanges; },
  async getWardrobeDoorStyles() { return wardrobeDoorStyles; },
  async getWardrobeDoorMelamineColours() { return wardrobeDoorMelamineColours; },
  async getWardrobeDoorMultiPanelOptions() { return wardrobeDoorMultiPanelOptions; },
  async getWardrobeDoorInserts() { return wardrobeDoorInserts; },
  async getWardrobeStilesAndTracks() { return wardrobeStilesAndTracks; },
  async getWardrobeExtras() { return wardrobeExtras; },
};
