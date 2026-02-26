import type {
  WardrobeConfiguratorState,
  WardrobeUIState,
  WardrobeTypeId,
  WardrobeDoorStyleId,
  WardrobeDimensions,
} from "@/domain/models/slidingDoorConfig";
import {
  createInitialWardrobeState
} from "@/domain/models/slidingDoorConfig";

export type WardrobeAction =
  | { type: "SET_WARDROBE_TYPE"; payload: WardrobeTypeId }
  | { type: "SET_DIMENSIONS"; payload: WardrobeDimensions }
  | { type: "SET_RANGE_AND_DOOR_COUNT"; payload: { rangeId: string; doorCount: number } }
  | { type: "SET_DOOR_STYLE"; payload: WardrobeDoorStyleId }
  | { type: "SET_MELAMINE_COLOUR"; payload: string }
  | { type: "SET_DOOR_PANEL_COUNT"; payload: { doorIndex: number; panelCount: 3 | 4 } }
  | { type: "SET_DOOR_MIRROR"; payload: { doorIndex: number; panelIndex: number; mirrored: boolean } }
  | { type: "SET_DOOR_INSERT"; payload: { doorIndex: number; insertId: string | null } }
  | { type: "SET_STILES_AND_TRACKS"; payload: string }
  | { type: "SET_EXTRA_QUANTITY"; payload: { extraId: string; quantity: number } }
  | { type: "SET_COMPLETED_STEP"; payload: number }
  | { type: "RESET" };

export type WardrobeUIAction =
  | { type: "SET_ROOM_COLOUR"; payload: string };

const buildDefaultDoorConfigurations = (doorCount: number) =>
  Array.from({ length: doorCount }, (_, i) => ({
    doorIndex: i,
    multiPanelCount: null,
    mirroredPanels: [],
    insertId: null,
  }));

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

    case "SET_DOOR_STYLE": {
      const incoming = action.payload;
      const current = state.wardrobeDoorStyleId;

      if (incoming === "MULTI_PANEL" && current === "PLAIN") {
        return {
          ...state,
          wardrobeDoorStyleId: incoming,
          wardrobeDoorConfigurations: buildDefaultDoorConfigurations(
            state.wardrobeDoorCount ?? 0
          ),
        };
      }

      if (incoming === "PLAIN" && current === "MULTI_PANEL") {
        return {
          ...state,
          wardrobeDoorStyleId: incoming,
          wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
            (door) => ({
              ...door,
              multiPanelCount: null,
              mirroredPanels: [],
            })
          ),
        };
      }

      return { ...state, wardrobeDoorStyleId: incoming };
    }

    case "SET_MELAMINE_COLOUR":
      return { ...state, wardrobeDoorMelamineColourId: action.payload };

    case "SET_DOOR_PANEL_COUNT": {
      const { doorIndex, panelCount } = action.payload;
      return {
        ...state,
        wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
          (door) =>
            door.doorIndex === doorIndex
              ? {
                  ...door,
                  multiPanelCount: panelCount,
                  mirroredPanels: Array(panelCount).fill(false),
                }
              : door
        ),
      };
    }

    case "SET_DOOR_MIRROR": {
      const { doorIndex, panelIndex, mirrored } = action.payload;
      return {
        ...state,
        wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
          (door) => {
            if (door.doorIndex !== doorIndex) return door;
            const updatedMirrors = [...door.mirroredPanels];
            updatedMirrors[panelIndex] = mirrored;
            return { ...door, mirroredPanels: updatedMirrors };
          }
        ),
      };
    }

    case "SET_DOOR_INSERT": {
      const { doorIndex, insertId } = action.payload;
      return {
        ...state,
        wardrobeDoorConfigurations: state.wardrobeDoorConfigurations.map(
          (door) =>
            door.doorIndex === doorIndex ? { ...door, insertId } : door
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