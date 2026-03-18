// ── Types ─────────────────────────────────────────────────────────────────────
// These mirror your frontend interfaces exactly

export interface PriceBreakdown {
  basePrice: number;
  wardrobeTypePrice: number;
  doorConfigPrice: number;
  stilesAndTracksPrice: number;
  trackPrice: number;
  extrasPrice: number;
  total: number;
}

export interface PricingInput {
  wardrobeType: {
    price: number;
  };
  widthRange: {
    doorCountPrices: Record<string, number>;
  };
  doorCount: number;
  doorInserts: {
    doorIndex: number;
    insert: { price: number } | null;
  }[];
  stilesAndTracks: {
    price: number;
  };
  extras: {
    id: string;
    price: number;
    quantity: number;
  }[];
}

// ── Track IDs — always free ───────────────────────────────────────────────────
const FREE_TRACK_IDS = ['extra-top-track', 'extra-bottom-track'];

// ── Pricing Engine ────────────────────────────────────────────────────────────
export const calculatePrice = (input: PricingInput): PriceBreakdown => {
  // 1. Base price — looked up by door count from width range
  const basePrice = input.widthRange.doorCountPrices[String(input.doorCount)] ?? 0;

  // 2. Wardrobe type price — currently 0 for all types, reserved for future
  const wardrobeTypePrice = input.wardrobeType.price;

  // 3. Door config price — sum of insert prices for doors that have an insert
  const doorConfigPrice = input.doorInserts.reduce((sum, door) => {
    return sum + (door.insert?.price ?? 0);
  }, 0);

  // 4. Stiles and tracks price
  const stilesAndTracksPrice = input.stilesAndTracks.price;

  // 5. Track price — always 0, tracks are included
  const trackPrice = 0;

  // 6. Extras price — sum of price × quantity, excluding top/bottom track
  const extrasPrice = input.extras.reduce((sum, extra) => {
    if (FREE_TRACK_IDS.includes(extra.id)) return sum;
    return sum + extra.price * extra.quantity;
  }, 0);

  // 7. Total
  const total =
    basePrice +
    wardrobeTypePrice +
    doorConfigPrice +
    stilesAndTracksPrice +
    trackPrice +
    extrasPrice;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    wardrobeTypePrice: Math.round(wardrobeTypePrice * 100) / 100,
    doorConfigPrice: Math.round(doorConfigPrice * 100) / 100,
    stilesAndTracksPrice: Math.round(stilesAndTracksPrice * 100) / 100,
    trackPrice: 0,
    extrasPrice: Math.round(extrasPrice * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};