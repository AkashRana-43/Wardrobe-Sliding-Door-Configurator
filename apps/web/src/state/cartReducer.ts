import type { CartState, CartItem } from "@/state/cartTypes";

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_ITEM"; payload: { id: string; item: Omit<CartItem, "id" | "addedAt" | "quantity"> } }
  | { type: "START_EDITING"; payload: string }
  | { type: "STOP_EDITING" }
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
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity ?? 1 }],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.item }
            : item
        ),
      };

    case "START_EDITING":
      return { ...state, editingItemId: action.payload };

    case "STOP_EDITING":
      return { ...state, editingItemId: null };

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
  editingItemId: null,
});