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

// ─── Width Ranges for Door Count ─────────────────────────────────────────────

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
  maxQuantity: number;
  isDefault: boolean;
}

// ─── Configurator State ───────────────────────────────────────────────────────

export interface WardrobeConfiguratorState {
  // Step 1
  wardrobeTypeId: WardrobeTypeId | null;

  // Step 2
  wardrobeDimensions: WardrobeDimensions | null;

  // Step 3
  wardrobeSelectedRangeId: string | null;
  wardrobeDoorCount: number | null;

  // Step 4
  wardrobeDoorMelamineColourId: string | null;
  wardrobeDoorConfigurations: WardrobeDoorConfiguration[];

  // Step 5
  wardrobeStilesAndTracksId: string | null;
  wardrobeSelectedExtras: Record<string, number>;

  // Final
  wardrobeDoorLastCompletedStep: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface WardrobeUIState {
  roomColour: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  wardrobeSnapshot: WardrobeConfiguratorState;
  priceBreakdown: PriceBreakdown;
  addedAt: number;
}

export interface PriceBreakdown {
  basePrice: number;
  wardrobeTypePrice: number;
  insertPrice: number;
  stilesAndTracksPrice: number;
  extrasPrice: number;
  total: number;
}

// ─── Initial States ───────────────────────────────────────────────────────────

export function createInitialWardrobeState(): WardrobeConfiguratorState {
  return {
    wardrobeTypeId: null,
    wardrobeDimensions: null,
    wardrobeSelectedRangeId: null,
    wardrobeDoorCount: null,
    wardrobeDoorMelamineColourId: null,
    wardrobeDoorConfigurations: [],
    wardrobeStilesAndTracksId: null,
    wardrobeSelectedExtras: {},
    wardrobeDoorLastCompletedStep: 0,
  };
}

export function createInitialWardrobeUIState(): WardrobeUIState {
  return {
    roomColour: "#ffffff",
  };
}