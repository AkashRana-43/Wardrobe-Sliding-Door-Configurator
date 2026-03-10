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
  quantity: number;
  addedAt: number;
  reference?: string;
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
  addToCart: (item: Omit<CartItem, "id" | "addedAt" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
}