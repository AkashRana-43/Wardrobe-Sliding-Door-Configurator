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
  insertPrice: 0,
  stilesAndTracksPrice: 0,
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

  const range = catalogue.widthRanges.find(
    (r) => r.id === state.wardrobeSelectedRangeId
  );
  const basePrice = range?.basePrice ?? 0;

  const wardrobeType = catalogue.wardrobeTypes.find(
    (t) => t.id === state.wardrobeTypeId
  );
  const wardrobeTypePrice = wardrobeType?.price ?? 0;

  const insertPrice = state.wardrobeDoorConfigurations.reduce(
    (sum, door) => {
      if (!door.insertId) return sum;
      const insert = catalogue.doorInserts.find((i) => i.id === door.insertId);
      return sum + (insert?.price ?? 0);
    },
    0
  );

  const stilesAndTracks = catalogue.stilesAndTracks.find(
    (s) => s.id === state.wardrobeStilesAndTracksId
  );
  const stilesAndTracksPrice = stilesAndTracks?.price ?? 0;

  const extrasPrice = Object.entries(state.wardrobeSelectedExtras).reduce(
    (sum, [extraId, quantity]) => {
      const extra = catalogue.extras.find((e) => e.id === extraId);
      return sum + (extra?.price ?? 0) * quantity;
    },
    0
  );

  const total =
    basePrice +
    wardrobeTypePrice +
    insertPrice +
    stilesAndTracksPrice +
    extrasPrice;

  return {
    basePrice,
    wardrobeTypePrice,
    insertPrice,
    stilesAndTracksPrice,
    extrasPrice,
    total,
  };
};