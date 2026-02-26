import type {
  WardrobeType,
  WardrobeWidthRange,
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from "@/domain/models/slidingDoorConfig";

export const wardrobeTypes: WardrobeType[] = [
  {
    id: "WALL_TO_WALL",
    name: "Wall to Wall",
    description: "Fits between two existing walls. No end panels required.",
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
    description: "End panels on both sides.",
    image: "/images/wardrobe-types/end-panel-to-end-panel.jpg",
    price: 0,
  },
];

export const wardrobeWidthRanges: WardrobeWidthRange[] = [
  { id: "range-1", minWidthMm: 0,    maxWidthMm: 1200, allowedDoorCounts: [2],       basePrice: 0 },
  { id: "range-2", minWidthMm: 1201, maxWidthMm: 1800, allowedDoorCounts: [2],       basePrice: 0 },
  { id: "range-3", minWidthMm: 1801, maxWidthMm: 2400, allowedDoorCounts: [2, 3],    basePrice: 0 },
  { id: "range-4", minWidthMm: 2401, maxWidthMm: 3000, allowedDoorCounts: [3, 4],    basePrice: 0 },
  { id: "range-5", minWidthMm: 3001, maxWidthMm: 3600, allowedDoorCounts: [3, 4, 5], basePrice: 0 },
  { id: "range-6", minWidthMm: 3601, maxWidthMm: 4200, allowedDoorCounts: [4, 5],    basePrice: 0 },
  { id: "range-7", minWidthMm: 4201, maxWidthMm: 4800, allowedDoorCounts: [4, 5],    basePrice: 0 },
  { id: "range-8", minWidthMm: 4801, maxWidthMm: 5100, allowedDoorCounts: [5],       basePrice: 0 },
];

export const wardrobeDoorMelamineColours: WardrobeDoorMelamineColour[] = [
  { id: "white-ash",   name: "White Ash",   image: "/images/melamine-colours/white-ash.jpg",   hexPreview: "#E8DDD0" },
  { id: "vanilla",     name: "Vanilla",     image: "/images/melamine-colours/vanilla.jpg",     hexPreview: "#F3EDD8" },
  { id: "lemon-tree",  name: "Lemon Tree",  image: "/images/melamine-colours/lemon-tree.jpg",  hexPreview: "#D4B483" },
  { id: "ivory",       name: "Ivory",       image: "/images/melamine-colours/ivory.jpg",       hexPreview: "#FFFFF0" },
  { id: "devine-oak",  name: "Devine Oak",  image: "/images/melamine-colours/devine-oak.jpg",  hexPreview: "#B8904A" },
  { id: "cloud-grey",  name: "Cloud Grey",  image: "/images/melamine-colours/cloud-grey.jpg",  hexPreview: "#D6D6D6" },
  { id: "polar-white", name: "Polar White", image: "/images/melamine-colours/polar-white.jpg", hexPreview: "#FAFAFA" },
];

export const wardrobeDoorInserts: WardrobeDoorInsert[] = [
  { id: "insert-mirror",             name: "Mirror",             price: 0, image: "/images/door-inserts/mirror.jpg" },
  { id: "insert-white-decor-glass",  name: "White Decor Glass",  price: 0, image: "/images/door-inserts/white-decor-glass.jpg" },
  { id: "insert-black-decor-glass",  name: "Black Decor Glass",  price: 0, image: "/images/door-inserts/black-decor-glass.jpg" },
  { id: "insert-super-white-glass",  name: "Super White Glass",  price: 0, image: "/images/door-inserts/super-white-glass.jpg" },
];

export const wardrobeStilesAndTracks: WardrobeStilesAndTracks[] = [
  { id: "stiles-tracks-silver",       name: "Silver",       colour: "#C0C0C0", price: 0, image: "/images/stiles-and-tracks/silver.jpg" },
  { id: "stiles-tracks-satin-black",  name: "Satin Black",  colour: "#2B2B2B", price: 0, image: "/images/stiles-and-tracks/satin-black.jpg" },
  { id: "stiles-tracks-matt-silver", name: "matt Silver", colour: "#C0C0C0", price: 0, image: "/images/stiles-and-tracks/matt-silver.jpg" },
  { id: "stiles-tracks-white",        name: "White",        colour: "#FAFAFA", price: 0, image: "/images/stiles-and-tracks/white.jpg" },
  { id: "stiles-tracks-birch",        name: "Birch",        colour: "#DEB887", price: 0, image: "/images/stiles-and-tracks/birch.jpg" },
];

export const wardrobeExtras: WardrobeExtra[] = [
  {
    id: "extra-top-track",
    name: "Top Track",
    price: 0,
    isDefault: true,
    maxQuantity: 1,
    images: {
      "stiles-tracks-silver":       "/images/extras/top-track-silver.jpg",
      "stiles-tracks-satin-black":  "/images/extras/top-track-satin-black.jpg",
      "stiles-tracks-matt-silver": "/images/extras/top-track-matt-silver.jpg",
      "stiles-tracks-white":        "/images/extras/top-track-white.jpg",
      "stiles-tracks-birch":        "/images/extras/top-track-birch.jpg",
    },
  },
  {
    id: "extra-bottom-track",
    name: "Bottom Track",
    price: 0,
    isDefault: true,
    maxQuantity: 1,
    images: {
      "stiles-tracks-silver":       "/images/extras/bottom-track-silver.jpg",
      "stiles-tracks-satin-black":  "/images/extras/bottom-track-satin-black.jpg",
      "stiles-tracks-matt-silver": "/images/extras/bottom-track-matt-silver.jpg",
      "stiles-tracks-white":        "/images/extras/bottom-track-white.jpg",
      "stiles-tracks-birch":        "/images/extras/bottom-track-birch.jpg",
    },
  },
  {
    id: "extra-wall-channel",
    name: "Wall Channel",
    price: 0,
    isDefault: false,
    maxQuantity: 2,
    images: {
      "stiles-tracks-silver":       "/images/extras/wall-channel-silver.jpg",
      "stiles-tracks-satin-black":  "/images/extras/wall-channel-satin-black.jpg",
      "stiles-tracks-matt-silver": "/images/extras/wall-channel-matt-silver.jpg",
      "stiles-tracks-white":        "/images/extras/wall-channel-white.jpg",
      "stiles-tracks-birch":        "/images/extras/wall-channel-birch.jpg",
    },
  },
  {
    id: "extra-end-panel",
    name: "End Panel",
    price: 0,
    isDefault: false,
    maxQuantity: 2,
    images: {
      "white-ash":   "/images/extras/end-panel-white-ash.jpg",
      "vanilla":     "/images/extras/end-panel-vanilla.jpg",
      "lemon-tree":  "/images/extras/end-panel-lemon-tree.jpg",
      "ivory":       "/images/extras/end-panel-ivory.jpg",
      "devine-oak":  "/images/extras/end-panel-devine-oak.jpg",
      "cloud-grey":  "/images/extras/end-panel-cloud-grey.jpg",
      "polar-white": "/images/extras/end-panel-polar-white.jpg",
    },
  },
  {
    id: "extra-16mm-end-panel-receiving-channel",
    name: "16mm End Panel Receiving Channel",
    price: 0,
    isDefault: false,
    maxQuantity: 2,
    images: {
      "stiles-tracks-silver":       "/images/extras/16mm-end-panel-receiving-channel-silver.jpg",
      "stiles-tracks-satin-black":  "/images/extras/16mm-end-panel-receiving-channel-satin-black.jpg",
      "stiles-tracks-matt-silver": "/images/extras/16mm-end-panel-receiving-channel-matt-silver.jpg",
      "stiles-tracks-white":        "/images/extras/16mm-end-panel-receiving-channel-white.jpg",
      "stiles-tracks-birch":        "/images/extras/16mm-end-panel-receiving-channel-birch.jpg",
    },
  },
  {
    id: "extra-16mm-end-panel-return-channel",
    name: "16mm End Panel Return Channel",
    price: 0,
    isDefault: false,
    maxQuantity: 2,
    images: {
      "stiles-tracks-silver":       "/images/extras/16mm-end-panel-return-channel-silver.jpg",
      "stiles-tracks-satin-black":  "/images/extras/16mm-end-panel-return-channel-satin-black.jpg",
      "stiles-tracks-matt-silver": "/images/extras/16mm-end-panel-return-channel-matt-silver.jpg",
      "stiles-tracks-white":        "/images/extras/16mm-end-panel-return-channel-white.jpg",
      "stiles-tracks-birch":        "/images/extras/16mm-end-panel-return-channel-birch.jpg",
    },
  },
];