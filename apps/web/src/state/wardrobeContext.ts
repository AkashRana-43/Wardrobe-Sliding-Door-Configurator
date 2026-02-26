import { createContext } from "react";
import type { WardrobeConfiguratorContextValue, WardrobeUIContextValue } from "@/state/wardrobeContextTypes";

export const WardrobeConfiguratorContext =
  createContext<WardrobeConfiguratorContextValue | null>(null);

export const WardrobeUIContext =
  createContext<WardrobeUIContextValue | null>(null);