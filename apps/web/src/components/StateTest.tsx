import { useWardrobeState } from "@/state/useWardrobeContext";

export const StateTest = () => {
  const { state, dispatch } = useWardrobeState();

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>State Test</h2>

      {/* Shows current state as raw JSON */}
      <pre>{JSON.stringify(state, null, 2)}</pre>

      {/* Test SET_WARDROBE_TYPE */}
      <button onClick={() =>
        dispatch({ type: "SET_WARDROBE_TYPE", payload: "WALL_TO_WALL" })
      }>
        Set Wall To Wall
      </button>

      {/* Test SET_DIMENSIONS and cascade */}
      <button onClick={() =>
        dispatch({ type: "SET_DIMENSIONS", payload: { widthMm: 2000, heightMm: 2400 } })
      }>
        Set Dimensions
      </button>

      {/* Test SET_RANGE_AND_DOOR_COUNT */}
      <button onClick={() =>
        dispatch({ type: "SET_RANGE_AND_DOOR_COUNT", payload: { rangeId: "range-3", doorCount: 3 } })
      }>
        Set 3 Doors
      </button>

      {/* Test RESET */}
      <button onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </div>
  );
};