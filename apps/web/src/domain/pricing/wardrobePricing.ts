import type {
  WardrobeConfiguratorState,
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
  PriceBreakdown,
} from "@/domain/models/slidingDoorConfig";

// ─── Catalogue ────────────────────────────────────────────────────────────────

export interface PricingCatalogue {
  wardrobeTypes: WardrobeType[];
  widthRanges: WardrobeWidthRange[];
  doorInserts: WardrobeDoorInsert[];
  stilesAndTracks: WardrobeStilesAndTracks[];
  extras: WardrobeExtra[];
}

// ─── Zero State ───────────────────────────────────────────────────────────────

const zeroPriceBreakdown: PriceBreakdown = {
  basePrice: 0,
  wardrobeTypePrice: 0,
  doorConfigPrice: 0,
  stilesAndTracksPrice: 0,
  trackPrice: 0,
  extrasPrice: 0,
  total: 0,
};

// ─── Calculator ───────────────────────────────────────────────────────────────

export const calculateWardrobePrice = (
  state: WardrobeConfiguratorState,
  catalogue: PricingCatalogue
): PriceBreakdown => {
  if (
    !state.wardrobeTypeId ||
    !state.wardrobeSelectedRangeId ||
    !state.wardrobeDoorCount
  ) {
    return zeroPriceBreakdown;
  }

  // ── Base price: range × door count ──────────────────────────────────
  const range = catalogue.widthRanges.find(
    (r) => r.id === state.wardrobeSelectedRangeId
  );
  const basePrice = range?.doorCountPrices[state.wardrobeDoorCount] ?? 0;

  // ── Wardrobe type price (reserved, currently 0) ──────────────────────
  const wardrobeType = catalogue.wardrobeTypes.find(
    (t) => t.id === state.wardrobeTypeId
  );
  const wardrobeTypePrice = wardrobeType?.price ?? 0;

  // ── Door config price: inserts × price per door ──────────────────────
  // Doors with no insert use the global melamine colour (free).
  const doorConfigPrice = state.wardrobeDoorConfigurations.reduce(
    (sum, door) => {
      if (!door.insertId) return sum;
      const insert = catalogue.doorInserts.find((i) => i.id === door.insertId);
      return sum + (insert?.price ?? 0);
    },
    0
  );

  // ── Stiles & tracks price (reserved, currently 0) ───────────────────
  const stilesAndTracks = catalogue.stilesAndTracks.find(
    (s) => s.id === state.wardrobeStilesAndTracksId
  );
  const stilesAndTracksPrice = stilesAndTracks?.price ?? 0;

  // ── Track price: always 0 — tracks are included ─────────────────────
  const trackPrice = 0;

  // ── Extras price: unit price × quantity (excludes top/bottom track) ──
  const extrasPrice = Object.entries(state.wardrobeSelectedExtras).reduce(
    (sum, [extraId, quantity]) => {
      if (extraId === "extra-top-track" || extraId === "extra-bottom-track") return sum;
      const extra = catalogue.extras.find((e) => e.id === extraId);
      return sum + (extra?.price ?? 0) * quantity;
    },
    0
  );

  const total =
    basePrice +
    wardrobeTypePrice +
    doorConfigPrice +
    stilesAndTracksPrice +
    trackPrice +
    extrasPrice;

  return {
    basePrice,
    wardrobeTypePrice,
    doorConfigPrice,
    stilesAndTracksPrice,
    trackPrice,
    extrasPrice,
    total,
  };
};