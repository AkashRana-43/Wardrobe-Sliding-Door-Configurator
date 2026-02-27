import { useContext } from "react";
import { AuthContext, CartContext } from "@/state/cartContext";
import type { AuthContextValue, CartContextValue } from "@/state/cartTypes";

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside CartAuthProvider");
  return ctx;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartAuthProvider");
  return ctx;
};