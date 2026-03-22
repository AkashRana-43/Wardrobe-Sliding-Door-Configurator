import type {
  WardrobeConfiguratorState,
  WardrobeTypeId,
  WardrobeDimensions,
} from "@/domain/models/slidingDoorConfig";
import { createInitialWardrobeState } from "@/domain/models/slidingDoorConfig";

// ─── Action Types ─────────────────────────────────────────────────────────────

export type WardrobeAction =
  | { type: "SET_WARDROBE_TYPE"; payload: WardrobeTypeId }
  | { type: "SET_DIMENSIONS"; payload: WardrobeDimensions }
  | { type: "SET_DIMENSIONS_VALIDITY"; payload: boolean }
  | {
      type: "SET_RANGE_AND_DOOR_COUNT";
      payload: { rangeId: string; doorCount: number };
    }
  | { type: "SET_MELAMINE_COLOUR"; payload: string }
  | { type: "CLEAR_MELAMINE_COLOUR" }
  | {
      type: "SET_DOOR_INSERT";
      payload: { doorIndex: number; insertId: string | null };
    }
  | { type: "SET_STILES_AND_TRACKS"; payload: string }
  | {
      type: "SET_EXTRA_QUANTITY";
      payload: { extraId: string; quantity: number };
    }
  | {
      type: "SET_TRACK_LENGTH";
      payload: { track: "top" | "bottom"; lengthMm: number | null };
    }
  | { type: "SET_COMPLETED_STEP"; payload: number }
  | { type: "LOAD_STATE"; payload: WardrobeConfiguratorState }
  | { type: "RESET" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildDefaultDoorConfigurations = (doorCount: number) =>
  Array.from({ length: doorCount }, (_, i) => ({
    doorIndex: i,
    insertId: null,
  }));

// ─── Reducer ──────────────────────────────────────────────────────────────────

export const wardrobeReducer = (
  state: WardrobeConfiguratorState,
  action: WardrobeAction,
): WardrobeConfiguratorState => {
  switch (action.type) {
    case "SET_WARDROBE_TYPE":
      return { ...state, wardrobeTypeId: action.payload };

    case "SET_DIMENSIONS":
      // Also resets downstream door state since width changed
      return {
        ...state,
        wardrobeDimensions: action.payload,
        isDimensionsValid: true,
        wardrobeSelectedRangeId: null,
        wardrobeDoorCount: null,
        wardrobeDoorConfigurations: [],
      };

    // Marks Step 2 inputs as valid or invalid WITHOUT touching any other
    // state. Step 6 reads isDimensionsValid to disable Update Cart when
    // one or both fields are empty — without wiping door count or inserts.
    case "SET_DIMENSIONS_VALIDITY":
      return { ...state, isDimensionsValid: action.payload };

    case "SET_RANGE_AND_DOOR_COUNT": {
      const { rangeId, doorCount } = action.payload;
      const configurationsUnchanged =
        state.wardrobeDoorCount === doorCount &&
        state.wardrobeDoorConfigurations.length === doorCount;
      return {
        ...state,
        wardrobeSelectedRangeId: rangeId,
        wardrobeDoorCount: doorCount,
        wardrobeDoorConfigurations: configurationsUnchanged
          ? state.wardrobeDoorConfigurations
          : buildDefaultDoorConfigurations(doorCount),
      };
    }

    case "SET_MELAMINE_COLOUR":
      return { ...state, wardrobeDoorMelamineColourId: action.payload };

    case "CLEAR_MELAMINE_COLOUR":
      return { ...state, wardrobeDoorMelamineColourId: null };

    case "SET_DOOR_INSERT": {
      const { doorIndex, insertId } = action.payload;
      return {
        ...state,
        wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
          (door) =>
            door.doorIndex === doorIndex ? { ...door, insertId } : door,
        ),
      };
    }

    case "SET_STILES_AND_TRACKS":
      return { ...state, wardrobeStilesAndTracksId: action.payload };

    case "SET_EXTRA_QUANTITY": {
      const { extraId, quantity } = action.payload;
      const updated = { ...state.wardrobeSelectedExtras };
      if (quantity <= 0) {
        delete updated[extraId];
      } else {
        updated[extraId] = quantity;
      }
      return { ...state, wardrobeSelectedExtras: updated };
    }

    case "SET_TRACK_LENGTH": {
      const { track, lengthMm } = action.payload;
      return {
        ...state,
        wardrobeTrackLengthMm: {
          ...state.wardrobeTrackLengthMm,
          [track]: lengthMm,
        },
      };
    }

    case "SET_COMPLETED_STEP":
      return {
        ...state,
        wardrobeDoorLastCompletedStep: Math.max(
          state.wardrobeDoorLastCompletedStep,
          action.payload,
        ),
      };

    case "LOAD_STATE":
      return { ...action.payload };

    case "RESET":
      return createInitialWardrobeState();

    default:
      return state;
  }
};