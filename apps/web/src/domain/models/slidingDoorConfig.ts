// ─── Wardrobe Type ────────────────────────────────────────────────────────────

export const WardrobeTypeId = {
  WALL_TO_WALL: "WALL_TO_WALL",
  WALL_TO_END_PANEL: "WALL_TO_END_PANEL",
  END_PANEL_TO_WALL: "END_PANEL_TO_WALL",
  END_PANEL_TO_END_PANEL: "END_PANEL_TO_END_PANEL",
} as const;

export type WardrobeTypeId =
  (typeof WardrobeTypeId)[keyof typeof WardrobeTypeId];

export interface WardrobeType {
  id: WardrobeTypeId;
  name: string;
  description: string;
  image: string;
  price: number;
}

// ─── Door Style ───────────────────────────────────────────────────────────────

export const WardrobeDoorStyleId = {
  PLAIN: "PLAIN",
  MULTI_PANEL: "MULTI_PANEL",
} as const;

export type WardrobeDoorStyleId =
  (typeof WardrobeDoorStyleId)[keyof typeof WardrobeDoorStyleId];

export interface WardrobeDoorStyle {
  id: WardrobeDoorStyleId;
  name: string;
  image: string;
}

// ─── Dimensions ───────────────────────────────────────────────────────────────

export interface WardrobeDimensions {
  widthMm: number;
  heightMm: number;
}

export interface WardrobeDimensionConstraints {
  minWidthMm: number;
  maxWidthMm: number;
  minHeightMm: number;
  maxHeightMm: number;
}

// ─── Width Ranges for Door Count ────────────────────────────────────────────────

export interface WardrobeWidthRange {
  id: string;
  minWidthMm: number;
  maxWidthMm: number;
  allowedDoorCounts: number[];
  basePrice: number;
}

// ─── Melamine Colours ─────────────────────────────────────────────────────────

export interface WardrobeDoorMelamineColour {
  id: string;
  name: string;
  image: string;
  hexPreview: string;
}

// ─── Multi-Panel ──────────────────────────────────────────────────────────────

export interface WardrobeDoorMultiPanelOption {
  id: string;
  panelCount: 3 | 4;
  price: number;
  image: string;
}

// ─── Door Inserts ─────────────────────────────────────────────────────────────

export interface WardrobeDoorInsert {
  id: string;
  name: string;
  price: number;
  image: string;
}

// ─── Per-Door Configuration ───────────────────────────────────────────────────

export interface WardrobeDoorConfiguration {
  doorIndex: number;
  multiPanelCount: 3 | 4 | null;
  mirroredPanels: boolean[];
  insertId: string | null;
}

// ─── Stiles and Tracks ────────────────────────────────────────────────────────

export interface WardrobeStilesAndTracks {
  id: string;
  name: string;
  colour: string;
  price: number;
  image: string;
}

// ─── Extras ───────────────────────────────────────────────────────────────────

export interface WardrobeExtra {
  id: string;
  name: string;
  price: number;
  images: Record<string, string>;
}

// ─── Configurator State ──────────────────────────────────────────

export interface WardrobeConfiguratorState {
  // Step 1
  wardrobeTypeId: WardrobeTypeId | null;

  // Step 2
  wardrobeDimensions: WardrobeDimensions | null;

  // Step 3
  wardrobeSelectedRangeId: string | null;
  wardrobeDoorCount: number | null;

  // Step 4
  wardrobeDoorStyleId: WardrobeDoorStyleId | null;
  wardrobeDoorMelamineColourId: string | null;
  wardrobeDoorConfigurations: WardrobeDoorConfiguration[];

  // Step 5
  wardrobeStilesAndTracksId: string | null;
  wardrobeSelectedExtraIds: string[];

  // Final
  wardrobeDoorLastCompletedStep: number;
}

// ─── UI State ────────────────────────────────────

export interface WardrobeUIState {
  roomColour: string; // hex or colour name, default '#ffffff'
}

// ─── Initial States ───────────────────────────────────────────────────────────

export function createInitialWardrobeState(): WardrobeConfiguratorState {
  return {
    wardrobeTypeId: null,
    wardrobeDimensions: null,
    wardrobeSelectedRangeId: null,
    wardrobeDoorCount: null,
    wardrobeDoorStyleId: null,
    wardrobeDoorMelamineColourId: null,
    wardrobeDoorConfigurations: [],
    wardrobeStilesAndTracksId: null,
    wardrobeSelectedExtraIds: [],
    wardrobeDoorLastCompletedStep: 0,
  };
}

export function createInitialWardrobeUIState(): WardrobeUIState {
  return {
    roomColour: "#ffffff",
  };
}
