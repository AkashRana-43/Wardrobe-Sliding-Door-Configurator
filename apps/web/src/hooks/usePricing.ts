import { useMemo } from "react";
import { useWardrobeState } from "@/state/useWardrobeContext";
import {
  calculateWardrobePrice,
  type PricingCatalogue,
} from "@/domain/pricing/wardrobePricing";
import type { PriceBreakdown } from "@/domain/models/slidingDoorConfig";

export const usePricing = (catalogue: PricingCatalogue): PriceBreakdown => {
  const { state } = useWardrobeState();

  return useMemo(
    () => calculateWardrobePrice(state, catalogue),
    [state, catalogue]
  );
};