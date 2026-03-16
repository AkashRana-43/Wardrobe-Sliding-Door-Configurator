import type React from "react";
import type { WardrobeConfiguratorState } from "@/domain/models/slidingDoorConfig";
import type { WardrobeAction } from "@/state/wardrobeReducer";

export interface WardrobeConfiguratorContextValue {
  state: WardrobeConfiguratorState;
  dispatch: React.Dispatch<WardrobeAction>;
}