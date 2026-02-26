import { useReducer, useMemo, type ReactNode } from "react";
import { wardrobeReducer, wardrobeUIReducer } from "@/state/wardrobeReducer";
import {
  createInitialWardrobeState,
  createInitialWardrobeUIState,
} from "@/domain/models/slidingDoorConfig";
import {
  WardrobeConfiguratorContext,
  WardrobeUIContext,
} from "@/state/wardrobeContext";

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    wardrobeReducer,
    undefined,
    createInitialWardrobeState
  );

  const [uiState, uiDispatch] = useReducer(
    wardrobeUIReducer,
    undefined,
    createInitialWardrobeUIState
  );

  const configuratorValue = useMemo(
    () => ({ state, dispatch }),
    [state, dispatch]
  );

  const uiValue = useMemo(
    () => ({ uiState, uiDispatch }),
    [uiState, uiDispatch]
  );

  return (
    <WardrobeConfiguratorContext.Provider value={configuratorValue}>
      <WardrobeUIContext.Provider value={uiValue}>
        {children}
      </WardrobeUIContext.Provider>
    </WardrobeConfiguratorContext.Provider>
  );
};