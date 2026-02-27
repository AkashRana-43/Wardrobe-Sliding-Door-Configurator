import type { AuthState } from "@/state/cartTypes";

export type AuthAction =
  | { type: "LOGIN" }
  | { type: "LOGOUT" };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

export const createInitialAuthState = (): AuthState => ({
  isLoggedIn: false,
});