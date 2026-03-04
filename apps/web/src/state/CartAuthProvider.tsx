import { useReducer, useMemo, useCallback, type ReactNode } from "react";
import { AuthContext, CartContext } from "@/state/cartContext";
import { authReducer, createInitialAuthState } from "@/state/authReducer";
import { cartReducer, createInitialCartState } from "@/state/cartReducer";
import type { CartItem } from "@/state/cartTypes";

export const CartAuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, authDispatch] = useReducer(
    authReducer,
    undefined,
    createInitialAuthState
  );

  const [cartState, cartDispatch] = useReducer(
    cartReducer,
    undefined,
    createInitialCartState
  );

  // ─── Auth Actions ─────────────────────────────────────────────────────────
  const login = useCallback(() => {
    authDispatch({ type: "LOGIN" });
  }, []);

  const logout = useCallback(() => {
    authDispatch({ type: "LOGOUT" });
  }, []);

  // ─── Cart Actions ─────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (item: Omit<CartItem, "id" | "addedAt" | "quantity">) => {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          ...item,
          quantity: 1,
          id: crypto.randomUUID(),
          addedAt: Date.now(),
        },
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    cartDispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    cartDispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const openCart = useCallback(() => {
    cartDispatch({ type: "OPEN_CART" });
  }, []);

  const closeCart = useCallback(() => {
    cartDispatch({ type: "CLOSE_CART" });
  }, []);

  // ─── Memoised Context Values ──────────────────────────────────────────────
  const authValue = useMemo(
    () => ({ authState, login, logout }),
    [authState, login, logout]
  );

  const cartValue = useMemo(
    () => ({ cartState, addToCart, removeFromCart, updateQuantity, openCart, closeCart }),
    [cartState, addToCart, removeFromCart, updateQuantity, openCart, closeCart]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};