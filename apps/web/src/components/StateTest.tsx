import { useWardrobeState } from "@/state/useWardrobeContext";
import { useAuth } from "@/state/useCartAuth";
import { useCart } from "@/state/useCartAuth";
import { calculateWardrobePrice } from "@/domain/pricing/wardrobePricing";
import {
  wardrobeTypes,
  wardrobeWidthRanges,
  wardrobeDoorInserts,
  wardrobeStilesAndTracks,
  wardrobeExtras,
} from "@/services/mock/slidingDoorMockData";

const catalogue = {
  wardrobeTypes,
  widthRanges: wardrobeWidthRanges,
  doorInserts: wardrobeDoorInserts,
  stilesAndTracks: wardrobeStilesAndTracks,
  extras: wardrobeExtras,
};

const btnStyle: React.CSSProperties = {
  backgroundColor: "#fa553c",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  cursor: "pointer",
  borderRadius: 4,
  marginLeft: 8,
};

export const StateTest = () => {
  const { state, dispatch } = useWardrobeState();
  const { authState, login, logout } = useAuth();
  const { cartState, addToCart, openCart, closeCart } = useCart();
  const breakdown = calculateWardrobePrice(state, catalogue);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>State Test</h2>

      {/* ─── Auth Buttons ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        {authState.isLoggedIn ? (
          <>
            <button
              style={btnStyle}
              onClick={() =>
                addToCart({
                  wardrobeSnapshot: state,
                  priceBreakdown: breakdown,
                })
              }
            >
              Add To Cart
            </button>
            <button style={btnStyle} onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <button style={btnStyle}>Ask a Quote</button>
            <button style={btnStyle} onClick={login}>
              Log In
            </button>
          </>
        )}
      </div>

      {/* ─── Cart Status ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <p>Logged in: {String(authState.isLoggedIn)}</p>
        <p>Cart items: {cartState.items.length}</p>
        <p>Cart open: {String(cartState.isOpen)}</p>
        <button style={btnStyle} onClick={openCart}>Open Cart</button>
        <button style={btnStyle} onClick={closeCart}>Close Cart</button>
      </div>

      {/* ─── Configurator Buttons ─────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <button
          style={btnStyle}
          onClick={() =>
            dispatch({ type: "SET_WARDROBE_TYPE", payload: "WALL_TO_WALL" })
          }
        >
          Set Wall To Wall
        </button>
        <button
          style={btnStyle}
          onClick={() =>
            dispatch({
              type: "SET_DIMENSIONS",
              payload: { widthMm: 2000, heightMm: 2400 },
            })
          }
        >
          Set Dimensions
        </button>
        <button
          style={btnStyle}
          onClick={() =>
            dispatch({
              type: "SET_RANGE_AND_DOOR_COUNT",
              payload: { rangeId: "range-3", doorCount: 3 },
            })
          }
        >
          Set 3 Doors
        </button>
        <button
          style={btnStyle}
          onClick={() => dispatch({ type: "RESET" })}
        >
          Reset
        </button>
      </div>

      {/* ─── Raw State ────────────────────────────────────────────── */}
      <h3>Price Breakdown</h3>
      <pre>{JSON.stringify(breakdown, null, 2)}</pre>

      <h3>Configurator State</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre>

      <h3>Cart State</h3>
      <pre>{JSON.stringify(cartState, null, 2)}</pre>
    </div>
  );
};