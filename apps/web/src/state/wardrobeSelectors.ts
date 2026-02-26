import type {
  WardrobeConfiguratorState,
  WardrobeWidthRange,
} from "@/domain/models/slidingDoorConfig";

export const selectCurrentWidthRange = (
  state: WardrobeConfiguratorState,
  widthRanges: WardrobeWidthRange[],
): WardrobeWidthRange | null => {
  if (!state.wardrobeDimensions) return null;

  const { widthMm } = state.wardrobeDimensions;

  for (const range of widthRanges) {
    if (widthMm >= range.minWidthMm && widthMm <= range.maxWidthMm) {
      return range;
    }
  }

  return null;
};


export const selectAllowedDoorCounts = (
  state: WardrobeConfiguratorState,
  widthRanges: WardrobeWidthRange[]
): number[] => {
  const range = selectCurrentWidthRange(state, widthRanges);
  if (!range) return [];
  return range.allowedDoorCounts;
};

export const selectIsDoorCountForced = (
  state: WardrobeConfiguratorState,
  widthRanges: WardrobeWidthRange[]
): boolean => {
    const allowedCounts = selectAllowedDoorCounts(state, widthRanges);
    return allowedCounts.length === 1;
}