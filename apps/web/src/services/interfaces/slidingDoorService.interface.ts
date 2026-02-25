import type {
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorStyle,
  WardrobeDoorMelamineColour,
  WardrobeDoorMultiPanelOption,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from "@/domain/models/slidingDoorConfig";

export interface ISlidingDoorService {
  getWardrobeTypes(): Promise<WardrobeType[]>;
  getWardrobeWidthRanges(): Promise<WardrobeWidthRange[]>;
  getWardrobeDoorStyles(): Promise<WardrobeDoorStyle[]>;
  getWardrobeDoorMelamineColours(): Promise<WardrobeDoorMelamineColour[]>;
  getWardrobeDoorMultiPanelOptions(): Promise<WardrobeDoorMultiPanelOption[]>;
  getWardrobeDoorInserts(): Promise<WardrobeDoorInsert[]>;
  getWardrobeStilesAndTracks(): Promise<WardrobeStilesAndTracks[]>;
  getWardrobeExtras(): Promise<WardrobeExtra[]>;
}
