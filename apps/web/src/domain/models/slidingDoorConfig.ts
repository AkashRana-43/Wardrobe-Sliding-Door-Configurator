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
  doorCountPrices: Record<number, number>; 
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
  price: number; // per door
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
  price: number; // reserved for future pricing
  image: string;
}

// ─── Extras ───────────────────────────────────────────────────────────────────
// Top Track and Bottom Track are priced per metre — use pricePerMetre.
// All other extras are priced per unit — use price.
// image: single static image (all extras including tracks).

export interface WardrobeExtra {
  id: string;
  name: string;
  price: number;          // per unit (non-track extras)
  pricePerMetre?: number; // per metre (top/bottom track only)
  image: string;
  maxQuantity: number;
  defaultQuantity?: Partial<Record<WardrobeTypeId, number>>;
}

// ─── Track Lengths ────────────────────────────────────────────────────────────

export interface WardrobeTrackLengthMm {
  top: number | null;
  bottom: number | null;
}

// ─── Configurator State ───────────────────────────────────────────────────────

export interface WardrobeConfiguratorState {
  wardrobeTypeId: WardrobeTypeId | null;
  wardrobeDimensions: WardrobeDimensions | null;
  wardrobeSelectedRangeId: string | null;
  wardrobeDoorCount: number | null;
  wardrobeDoorMelamineColourId: string | null;      // global colour applied to all doors
  wardrobeDoorConfigurations: WardrobeDoorConfiguration[];
  wardrobeStilesAndTracksId: string | null;
  wardrobeSelectedExtras: Record<string, number>;   // extraId → quantity
  wardrobeTrackLengthMm: WardrobeTrackLengthMm;    // mm input for top/bottom track pricing
  wardrobeDoorLastCompletedStep: number;
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

export interface PriceBreakdown {
  basePrice: number;
  wardrobeTypePrice: number; 
  doorConfigPrice: number; 
  stilesAndTracksPrice: number; 
  trackPrice: number; 
  extrasPrice: number;
  total: number;
}

// ─── Initial State ────────────────────────────────────────────────────────────

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
    wardrobeTrackLengthMm: { top: null, bottom: null },
    wardrobeDoorLastCompletedStep: 0,
  };
}