import type {
  WardrobeConfiguratorState,
  PriceBreakdown,
} from "@/domain/models/slidingDoorConfig";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  isLoggedIn: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  wardrobeSnapshot: WardrobeConfiguratorState;
  priceBreakdown: PriceBreakdown;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// ─── Context Value Types ──────────────────────────────────────────────────────

export interface AuthContextValue {
  authState: AuthState;
  login: () => void;
  logout: () => void;
}

export interface CartContextValue {
  cartState: CartState;
  addToCart: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
}