import type {
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from "@/domain/models/slidingDoorConfig";

export interface ISlidingDoorService {
  getWardrobeTypes(): Promise<WardrobeType[]>;
  getWardrobeWidthRanges(): Promise<WardrobeWidthRange[]>;
  getWardrobeDoorMelamineColours(): Promise<WardrobeDoorMelamineColour[]>;
  getWardrobeDoorInserts(): Promise<WardrobeDoorInsert[]>;
  getWardrobeStilesAndTracks(): Promise<WardrobeStilesAndTracks[]>;
  getWardrobeExtras(): Promise<WardrobeExtra[]>;
}