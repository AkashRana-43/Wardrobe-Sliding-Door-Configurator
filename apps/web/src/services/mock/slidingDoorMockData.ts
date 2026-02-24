import type {
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorStyle,
  WardrobeDoorMelamineColour,
  WardrobeDoorMultiPanelOption,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from "@/domain/models/slidingDoorConfig";

// ─── Wardrobe Types ───────────────────────────────────────────────────────────

export const wardrobeTypes: WardrobeType[] = [
  {
    id: "WALL_TO_WALL",
    name: "Wall to Wall",
    description: "Fits flush between two existing walls. No end panels required.",
    image: "/images/wardrobe-types/wall-to-wall.jpg",
    price: 0,
  },
  {
    id: "WALL_TO_END_PANEL",
    name: "Wall to End Panel",
    description: "Fixed to a wall on the left, finished with an end panel on the right.",
    image: "/images/wardrobe-types/wall-to-end-panel.jpg",
    price: 0,
  },
  {
    id: "END_PANEL_TO_WALL",
    name: "End Panel to Wall",
    description: "Finished with an end panel on the left, fixed to a wall on the right.",
    image: "/images/wardrobe-types/end-panel-to-wall.jpg",
    price: 0,
  },
  {
    id: "END_PANEL_TO_END_PANEL",
    name: "End Panel to End Panel",
    description: "Fully freestanding finish. End panels close off both sides.",
    image: "/images/wardrobe-types/end-panel-to-end-panel.jpg",
    price: 0,
  },
];

// ─── Width Ranges ─────────────────────────────────────────────────────────────

export const wardrobeWidthRanges: WardrobeWidthRange[] = [
  {
    id: "range-1",
    minWidthMm: 0,
    maxWidthMm: 1200,
    allowedDoorCounts: [2],
    basePrice: 0,
  },
  {
    id: "range-2",
    minWidthMm: 1201,
    maxWidthMm: 1800,
    allowedDoorCounts: [2],
    basePrice: 0,
  },
  {
    id: "range-3",
    minWidthMm: 1801,
    maxWidthMm: 2400,
    allowedDoorCounts: [2, 3],
    basePrice: 0,
  },
  {
    id: "range-4",
    minWidthMm: 2401,
    maxWidthMm: 3000,
    allowedDoorCounts: [3, 4],
    basePrice: 0,
  },
  {
    id: "range-5",
    minWidthMm: 3001,
    maxWidthMm: 3600,
    allowedDoorCounts: [3, 4, 5],
    basePrice: 0,
  },
  {
    id: "range-6",
    minWidthMm: 3601,
    maxWidthMm: 4200,
    allowedDoorCounts: [4, 5],
    basePrice: 0,
  },
  {
    id: "range-7",
    minWidthMm: 4201,
    maxWidthMm: 4800,
    allowedDoorCounts: [4, 5],
    basePrice: 0,
  },
  {
    id: "range-8",
    minWidthMm: 4801,
    maxWidthMm: 5100,
    allowedDoorCounts: [5],
    basePrice: 0,
  },
];

// ─── Door Styles ──────────────────────────────────────────────────────────────

export const wardrobeDoorStyles: WardrobeDoorStyle[] = [
  {
    id: "PLAIN",
    name: "Plain",
    image: "/images/door-styles/plain.jpg",
  },
  {
    id: "MULTI_PANEL",
    name: "Multi Panel",
    image: "/images/door-styles/multi-panel.jpg",
  },
];

// ─── Melamine Colours ─────────────────────────────────────────────────────────

export const wardrobeDoorMelamineColours: WardrobeDoorMelamineColour[] = [
  {
    id: "white-ash",
    name: "White Ash",
    image: "/images/melamine-colours/white-ash.jpg",
    hexPreview: "#E8DDD0", 
  },
  {
    id: "vanilla",
    name: "Vanilla",
    image: "/images/melamine-colours/vanilla.jpg",
    hexPreview: "#F3EDD8",
  },
  {
    id: "lemon-tree",
    name: "Lemon Tree",
    image: "/images/melamine-colours/lemon-tree.jpg",
    hexPreview: "#D4B483", 
  },
  {
    id: "ivory",
    name: "Ivory",
    image: "/images/melamine-colours/ivory.jpg",
    hexPreview: "#FFFFF0",
  },
  {
    id: "devine-oak",
    name: "Devine Oak",
    image: "/images/melamine-colours/devine-oak.jpg",
    hexPreview: "#B8904A",
  },
  {
    id: "cloud-grey",
    name: "Cloud Grey",
    image: "/images/melamine-colours/cloud-grey.jpg",
    hexPreview: "#D6D6D6",
  },
  {
    id: "polar-white",
    name: "Polar White",
    image: "/images/melamine-colours/polar-white.jpg",
    hexPreview: "#FAFAFA",
  },
];

// ─── Multi-Panel Options ──────────────────────────────────────────────────────

export const wardrobeDoorMultiPanelOptions: WardrobeDoorMultiPanelOption[] = [
  {
    id: "multi-panel-3",
    panelCount: 3,
    price: 0,
    image: "/images/multi-panel/3-panel.jpg",
  },
  {
    id: "multi-panel-4",
    panelCount: 4,
    price: 0,
    image: "/images/multi-panel/4-panel.jpg",
  },
];

// ─── Door Inserts ─────────────────────────────────────────────────────────────

export const wardrobeDoorInserts: WardrobeDoorInsert[] = [
  {
    id: "insert-mirror",
    name: "Mirror",
    price: 0,
    image: "/images/door-inserts/mirror.jpg",
  },
  {
    id: "insert-white-decor-glass",
    name: "White Decor Glass",
    price: 0,
    image: "/images/door-inserts/white-decor-glass.jpg",
  },
  {
    id: "insert-black-decor-glass",
    name: "Black Decor Glass",
    price: 0,
    image: "/images/door-inserts/black-decor-glass.jpg",
  },
  {
    id: "insert-super-white-glass",
    name: "Super White Glass",
    price: 0,
    image: "/images/door-inserts/super-white-glass.jpg",
  },
];

// ─── Stiles and Tracks ────────────────────────────────────────────────────────

export const wardrobeStilesAndTracks: WardrobeStilesAndTracks[] = [
  {
    id: "stiles-tracks-silver",
    name: "Silver",
    colour: "#C0C0C0",
    price: 0,
    image: "/images/stiles-and-tracks/silver.jpg",
  },
  {
    id: "stiles-tracks-satin-black",
    name: "Satin Black",
    colour: "#2B2B2B",
    price: 0,
    image: "/images/stiles-and-tracks/satin-black.jpg",
  },
  {
    id: "stiles-tracks-matte-silver",
    name: "Matte Silver",
    colour: "#C0C0C0",
    price: 0,
    image: "/images/stiles-and-tracks/matte-silver.jpg",
  },
  {
    id: "stiles-tracks-grey",
    name: "Grey",
    colour: "#808080",
    price: 0,
    image: "/images/stiles-and-tracks/grey.jpg",
  },
  {
    id: "stiles-tracks-white",
    name: "White",
    colour: "#FAFAFA",
    price: 0,
    image: "/images/stiles-and-tracks/white.jpg",
  },
  {
    id: "stiles-tracks-birch",
    name: "Birch",
    colour: "#DEB887",
    price: 0,
    image: "/images/stiles-and-tracks/birch.jpg",
  },
  {
    id:"stiles-tracks-almond-ivory",
    name: "Almond Ivory",
    colour: "#FFFFF0",
    price: 0,
    image: "/images/stiles-and-tracks/almond-ivory.jpg",
  }
];

// ─── Extras ───────────────────────────────────────────────────────────────────

export const wardrobeExtras: WardrobeExtra[] = [
  {
    id: "extra-top-track",
    name: "Top Track",
    price: 0,
    images: {
      default: "/images/extras/top-track.jpg",
    },
  },
  {
    id: "extra-bottom-track",
    name: "Bottom Track",
    price: 0,
    images: {
      default: "/images/extras/bottom-track.jpg",
    },
  },
  {
    id: "extra-16mm-end-panel-receiving-channel",
    name: "16mm End Panel Receiving Channel",
    price: 0,
    images: {
      default: "/images/extras/16mm-end-panel-receiving-channel.jpg",
    },
  },
  {
    id: "extra-wall-channel",
    name: "Wall Channel",
    price: 0,
    images: {
      default: "/images/extras/wall-channel.jpg",
    },
  },
  {
    id: "extra-16mm-end-panel-return-channel",
    name: "16mm End Panel Return Channel",
    price: 0,
    images: {
      default: "/images/extras/16mm-end-panel-return-channel.jpg",
    },
  }
];