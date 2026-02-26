import type {
  WardrobeConfiguratorState,
  WardrobeUIState,
  WardrobeTypeId,
  WardrobeDimensions,
} from "@/domain/models/slidingDoorConfig";
import {
  createInitialWardrobeState,
} from "@/domain/models/slidingDoorConfig";

// ─── Action Types ─────────────────────────────────────────────────────────────

export type WardrobeAction =
  | { type: "SET_WARDROBE_TYPE"; payload: WardrobeTypeId }
  | { type: "SET_DIMENSIONS"; payload: WardrobeDimensions }
  | { type: "SET_RANGE_AND_DOOR_COUNT"; payload: { rangeId: string; doorCount: number } }
  | { type: "SET_MELAMINE_COLOUR"; payload: string }
  | { type: "SET_DOOR_INSERT"; payload: { doorIndex: number; insertId: string | null } }
  | { type: "SET_STILES_AND_TRACKS"; payload: string }
  | { type: "SET_EXTRA_QUANTITY"; payload: { extraId: string; quantity: number } }
  | { type: "SET_COMPLETED_STEP"; payload: number }
  | { type: "RESET" };

export type WardrobeUIAction =
  | { type: "SET_ROOM_COLOUR"; payload: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildDefaultDoorConfigurations = (doorCount: number) =>
  Array.from({ length: doorCount }, (_, i) => ({
    doorIndex: i,
    insertId: null,
  }));

// ─── Configurator Reducer ─────────────────────────────────────────────────────

export const wardrobeReducer = (
  state: WardrobeConfiguratorState,
  action: WardrobeAction
): WardrobeConfiguratorState => {
  switch (action.type) {

    case "SET_WARDROBE_TYPE":
      return { ...state, wardrobeTypeId: action.payload };

    case "SET_DIMENSIONS":
      return {
        ...state,
        wardrobeDimensions: action.payload,
        wardrobeSelectedRangeId: null,
        wardrobeDoorCount: null,
        wardrobeDoorConfigurations: [],
      };

    case "SET_RANGE_AND_DOOR_COUNT": {
      const { rangeId, doorCount } = action.payload;
      return {
        ...state,
        wardrobeSelectedRangeId: rangeId,
        wardrobeDoorCount: doorCount,
        wardrobeDoorConfigurations: buildDefaultDoorConfigurations(doorCount),
      };
    }

    case "SET_MELAMINE_COLOUR":
      return { ...state, wardrobeDoorMelamineColourId: action.payload };

    case "SET_DOOR_INSERT": {
      const { doorIndex, insertId } = action.payload;
      return {
        ...state,
        wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
          (door) => door.doorIndex === doorIndex ? { ...door, insertId } : door
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

    case "SET_COMPLETED_STEP":
      return {
        ...state,
        wardrobeDoorLastCompletedStep: Math.max(
          state.wardrobeDoorLastCompletedStep,
          action.payload
        ),
      };

    case "RESET":
      return createInitialWardrobeState();

    default:
      return state;
  }
};

// ─── UI Reducer ───────────────────────────────────────────────────────────────

export const wardrobeUIReducer = (
  state: WardrobeUIState,
  action: WardrobeUIAction
): WardrobeUIState => {
  switch (action.type) {
    case "SET_ROOM_COLOUR":
      return { ...state, roomColour: action.payload };
    default:
      return state;
  }
};