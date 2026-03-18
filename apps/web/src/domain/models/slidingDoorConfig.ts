// ─── Strapi Media ─────────────────────────────────────────────────────────────
export interface StrapiMedia {
  url: string;
  alternativeText?: string;
}

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
  image: StrapiMedia | null;
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
  image: StrapiMedia | null;
  hexPreview: string;
}

// ─── Door Inserts ─────────────────────────────────────────────────────────────

export interface WardrobeDoorInsert {
  id: string;
  name: string;
  price: number;
  image: StrapiMedia | null;
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
  image: StrapiMedia | null;
}

// ─── Extras ───────────────────────────────────────────────────────────────────

export interface WardrobeExtra {
  id: string;
  name: string;
  price: number;
  pricePerMetre?: number;
  image: StrapiMedia | null;
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
  wardrobeDoorMelamineColourId: string | null; 
  wardrobeDoorConfigurations: WardrobeDoorConfiguration[];
  wardrobeStilesAndTracksId: string | null;
  wardrobeSelectedExtras: Record<string, number>; 
  wardrobeTrackLengthMm: WardrobeTrackLengthMm; 
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