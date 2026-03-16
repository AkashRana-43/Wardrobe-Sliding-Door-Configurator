import { useContext } from "react";
import { WardrobeConfiguratorContext } from "@/state/wardrobeContext";
import type { WardrobeConfiguratorContextValue } from "@/state/wardrobeContextTypes";

export const useWardrobeState = (): WardrobeConfiguratorContextValue => {
  const ctx = useContext(WardrobeConfiguratorContext);
  if (!ctx) throw new Error("useWardrobeState must be used inside WardrobeProvider");
  return ctx;
};