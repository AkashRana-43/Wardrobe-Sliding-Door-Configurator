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
    image: { url: "/images/wardrobe-types/wall-to-wall.jpg", alternativeText: "Wall to Wall" },
    price: 0,
  },
  {
    id: "WALL_TO_END_PANEL",
    name: "Wall to End Panel",
    description: "Fixed to a wall on the left, finished with an end panel on the right.",
    image: { url: "/images/wardrobe-types/wall-to-end-panel.jpg", alternativeText: "Wall to End Panel" },
    price: 0,
  },
  {
    id: "END_PANEL_TO_WALL",
    name: "End Panel to Wall",
    description: "Finished with an end panel on the left, fixed to a wall on the right.",
    image: { url: "/images/wardrobe-types/end-panel-to-wall.jpg", alternativeText: "End Panel to Wall" },
    price: 0,
  },
  {
    id: "END_PANEL_TO_END_PANEL",
    name: "End Panel to End Panel",
    description: "End panels on both sides.",
    image: { url: "/images/wardrobe-types/end-panel-to-end-panel.jpg", alternativeText: "End Panel to End Panel" },
    price: 0,
  },
];

export const wardrobeWidthRanges: WardrobeWidthRange[] = [
  { id: "range-1", minWidthMm: 0,    maxWidthMm: 1200, allowedDoorCounts: [2],       doorCountPrices: { 2: 458.56 } },
  { id: "range-2", minWidthMm: 1201, maxWidthMm: 1800, allowedDoorCounts: [2],       doorCountPrices: { 2: 468.52 } },
  { id: "range-3", minWidthMm: 1801, maxWidthMm: 2400, allowedDoorCounts: [2, 3],    doorCountPrices: { 2: 548.04, 3: 721.60 } },
  { id: "range-4", minWidthMm: 2401, maxWidthMm: 3000, allowedDoorCounts: [3, 4],    doorCountPrices: { 3: 802.42, 4: 950.88 } },
  { id: "range-5", minWidthMm: 3001, maxWidthMm: 3600, allowedDoorCounts: [3, 4, 5], doorCountPrices: { 3: 789.13, 4: 984.64, 5: 1180.16 } },
  { id: "range-6", minWidthMm: 3601, maxWidthMm: 4200, allowedDoorCounts: [4, 5],    doorCountPrices: { 4: 1036.99, 5: 1213.92 } },
  { id: "range-7", minWidthMm: 4201, maxWidthMm: 4800, allowedDoorCounts: [4, 5],    doorCountPrices: { 4: 1052.17, 5: 1258.30 } },
  { id: "range-8", minWidthMm: 4801, maxWidthMm: 5100, allowedDoorCounts: [5],       doorCountPrices: { 5: 1296.70 } },
];

export const wardrobeDoorMelamineColours: WardrobeDoorMelamineColour[] = [
  { id: "white-ash",   name: "White Ash",   image: { url: "/images/melamine-colours/white-ash.jpg",   alternativeText: "White Ash" },   hexPreview: "#ebebeb" },
  { id: "vanilla",     name: "Vanilla",     image: { url: "/images/melamine-colours/vanilla.jpg",     alternativeText: "Vanilla" },     hexPreview: "#f5eeda" },
  { id: "lemon-tree",  name: "Lemon Tree",  image: { url: "/images/melamine-colours/lemon-tree.jpg",  alternativeText: "Lemon Tree" },  hexPreview: "#D4B483" },
  { id: "ivory",       name: "Ivory",       image: { url: "/images/melamine-colours/ivory.jpg",       alternativeText: "Ivory" },       hexPreview: "#f7f7f2" },
  { id: "devine-oak",  name: "Devine Oak",  image: { url: "/images/melamine-colours/devine-oak.jpg",  alternativeText: "Devine Oak" },  hexPreview: "#B8904A" },
  { id: "cloud-grey",  name: "Cloud Grey",  image: { url: "/images/melamine-colours/cloud-grey.jpg",  alternativeText: "Cloud Grey" },  hexPreview: "#f2f2f2" },
  { id: "polar-white", name: "Polar White", image: { url: "/images/melamine-colours/polar-white.jpg", alternativeText: "Polar White" }, hexPreview: "#FAFAFA" },
];

export const wardrobeDoorInserts: WardrobeDoorInsert[] = [
  { id: "insert-mirror",            name: "Mirror",            price: 118.19, image: { url: "/images/door-inserts/mirror.jpg",            alternativeText: "Mirror" } },
  { id: "insert-white-decor-glass", name: "White Decor Glass", price: 130.01, image: { url: "/images/door-inserts/white-decor-glass.jpg", alternativeText: "White Decor Glass" } },
  { id: "insert-black-decor-glass", name: "Black Decor Glass", price: 130.01, image: { url: "/images/door-inserts/black-decor-glass.jpg", alternativeText: "Black Decor Glass" } },
  { id: "insert-super-white-glass", name: "Super White Glass", price: 165.47, image: { url: "/images/door-inserts/super-white-glass.jpg", alternativeText: "Super White Glass" } },
];

export const wardrobeStilesAndTracks: WardrobeStilesAndTracks[] = [
  { id: "stiles-tracks-silver",      name: "Silver",      colour: "#dfdfdf", price: 0, image: { url: "/images/stiles-and-tracks/silver.jpg",      alternativeText: "Silver" } },
  { id: "stiles-tracks-black",       name: "Black",       colour: "#000000", price: 0, image: { url: "/images/stiles-and-tracks/black.jpg",       alternativeText: "Black" } },
  { id: "stiles-tracks-matt-silver", name: "Matt Silver", colour: "#C0C0C0", price: 0, image: { url: "/images/stiles-and-tracks/matt-silver.jpg", alternativeText: "Matt Silver" } },
  { id: "stiles-tracks-white",       name: "White",       colour: "#FAFAFA", price: 0, image: { url: "/images/stiles-and-tracks/white.jpg",       alternativeText: "White" } },
  { id: "stiles-tracks-birch",       name: "Birch",       colour: "#eecda2", price: 0, image: { url: "/images/stiles-and-tracks/birch.jpg",       alternativeText: "Birch" } },
];

export const wardrobeExtras: WardrobeExtra[] = [
  {
    id: "extra-top-track",
    name: "Top Track",
    price: 0,
    pricePerMetre: 25.97,
    maxQuantity: 1,
    image: { url: "/images/extras/top-track.jpg", alternativeText: "Top Track" },
  },
  {
    id: "extra-bottom-track",
    name: "Bottom Track",
    price: 0,
    pricePerMetre: 17.49,
    maxQuantity: 1,
    image: { url: "/images/extras/bottom-track.jpg", alternativeText: "Bottom Track" },
  },
  {
    id: "extra-wall-channel",
    name: "Wall Channel",
    price: 27.24,
    maxQuantity: 10,
    image: { url: "/images/extras/wall-channel.jpg", alternativeText: "Wall Channel" },
    defaultQuantity: { WALL_TO_WALL: 2, WALL_TO_END_PANEL: 1, END_PANEL_TO_WALL: 1, END_PANEL_TO_END_PANEL: 0 },
  },
  {
    id: "extra-end-panel",
    name: "End Panel",
    price: 90.6,
    maxQuantity: 10,
    image: { url: "/images/extras/end-panel.jpg", alternativeText: "End Panel" },
    defaultQuantity: { WALL_TO_WALL: 0, WALL_TO_END_PANEL: 1, END_PANEL_TO_WALL: 1, END_PANEL_TO_END_PANEL: 2 },
  },
  {
    id: "extra-16mm-end-panel-receiving-channel",
    name: "16mm End Panel Receiving Channel",
    price: 15.79,
    maxQuantity: 10,
    image: { url: "/images/extras/16mm-end-panel-receiving-channel.jpg", alternativeText: "16mm End Panel Receiving Channel" },
    defaultQuantity: { WALL_TO_WALL: 0, WALL_TO_END_PANEL: 1, END_PANEL_TO_WALL: 1, END_PANEL_TO_END_PANEL: 2 },
  },
  {
    id: "extra-16mm-end-panel-return-channel",
    name: "16mm End Panel Return Channel",
    price: 39.75,
    maxQuantity: 10,
    image: { url: "/images/extras/16mm-end-panel-return-channel.jpg", alternativeText: "16mm End Panel Return Channel" },
    defaultQuantity: { WALL_TO_WALL: 0, WALL_TO_END_PANEL: 1, END_PANEL_TO_WALL: 1, END_PANEL_TO_END_PANEL: 2 },
  },
];