import { createContext } from "react";
import type { WardrobeConfiguratorContextValue } from "@/state/wardrobeContextTypes";

export const WardrobeConfiguratorContext =
  createContext<WardrobeConfiguratorContextValue | null>(null);