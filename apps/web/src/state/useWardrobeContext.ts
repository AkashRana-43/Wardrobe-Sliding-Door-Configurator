import { useContext } from "react";
import {
  WardrobeConfiguratorContext,
  WardrobeUIContext,
} from "@/state/wardrobeContext";
import type {
  WardrobeConfiguratorContextValue,
  WardrobeUIContextValue,
} from "@/state/wardrobeContextTypes";

export const useWardrobeState = (): WardrobeConfiguratorContextValue => {
  const ctx = useContext(WardrobeConfiguratorContext);
  if (!ctx) throw new Error("useWardrobeState must be used inside WardrobeProvider");
  return ctx;
};

export const useWardrobeUIState = (): WardrobeUIContextValue => {
  const ctx = useContext(WardrobeUIContext);
  if (!ctx) throw new Error("useWardrobeUIState must be used inside WardrobeProvider");
  return ctx;
};