import type { CartState, CartItem } from "@/state/cartTypes";

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {

    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
};

export const createInitialCartState = (): CartState => ({
  items: [],
  isOpen: false,
});