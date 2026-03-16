import { useReducer, useMemo, type ReactNode } from "react";
import { wardrobeReducer } from "@/state/wardrobeReducer";
import { createInitialWardrobeState } from "@/domain/models/slidingDoorConfig";
import { WardrobeConfiguratorContext } from "@/state/wardrobeContext";

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    wardrobeReducer,
    undefined,
    createInitialWardrobeState
  );

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <WardrobeConfiguratorContext.Provider value={value}>
      {children}
    </WardrobeConfiguratorContext.Provider>
  );
};