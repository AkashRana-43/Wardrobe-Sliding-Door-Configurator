import type React from "react";
import type { WardrobeConfiguratorState, WardrobeUIState } from "@/domain/models/slidingDoorConfig";
import type { WardrobeAction, WardrobeUIAction } from "@/state/wardrobeReducer";

export interface WardrobeConfiguratorContextValue {
  state: WardrobeConfiguratorState;
  dispatch: React.Dispatch<WardrobeAction>;
}

export interface WardrobeUIContextValue {
  uiState: WardrobeUIState;
  uiDispatch: React.Dispatch<WardrobeUIAction>;
}