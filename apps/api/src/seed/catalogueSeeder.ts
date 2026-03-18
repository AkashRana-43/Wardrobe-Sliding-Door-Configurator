import type { Core } from '@strapi/strapi';

const wardrobeTypes = [
  { uid: 'WALL_TO_WALL',             name: 'Wall to Wall',             description: 'Fits between two existing walls. No end panels required.',                         price: 0 },
  { uid: 'WALL_TO_END_PANEL',        name: 'Wall to End Panel',        description: 'Fixed to a wall on the left, finished with an end panel on the right.',            price: 0 },
  { uid: 'END_PANEL_TO_WALL',        name: 'End Panel to Wall',        description: 'Finished with an end panel on the left, fixed to a wall on the right.',            price: 0 },
  { uid: 'END_PANEL_TO_END_PANEL',   name: 'End Panel to End Panel',   description: 'End panels on both sides.',                                                        price: 0 },
];

const wardrobeWidthRanges = [
  { uid: 'range-1', minWidthMm: 0,    maxWidthMm: 1200, allowedDoorCounts: [2],       doorCountPrices: { '2': 458.56 } },
  { uid: 'range-2', minWidthMm: 1201, maxWidthMm: 1800, allowedDoorCounts: [2],       doorCountPrices: { '2': 468.52 } },
  { uid: 'range-3', minWidthMm: 1801, maxWidthMm: 2400, allowedDoorCounts: [2, 3],    doorCountPrices: { '2': 548.04, '3': 721.60 } },
  { uid: 'range-4', minWidthMm: 2401, maxWidthMm: 3000, allowedDoorCounts: [3, 4],    doorCountPrices: { '3': 802.42, '4': 950.88 } },
  { uid: 'range-5', minWidthMm: 3001, maxWidthMm: 3600, allowedDoorCounts: [3, 4, 5], doorCountPrices: { '3': 789.13, '4': 984.64, '5': 1180.16 } },
  { uid: 'range-6', minWidthMm: 3601, maxWidthMm: 4200, allowedDoorCounts: [4, 5],    doorCountPrices: { '4': 1036.99, '5': 1213.92 } },
  { uid: 'range-7', minWidthMm: 4201, maxWidthMm: 4800, allowedDoorCounts: [4, 5],    doorCountPrices: { '4': 1052.17, '5': 1258.30 } },
  { uid: 'range-8', minWidthMm: 4801, maxWidthMm: 5100, allowedDoorCounts: [5],       doorCountPrices: { '5': 1296.70 } },
];

const wardrobeDoorMelamineColours = [
  { uid: 'white-ash',   name: 'White Ash',   hexPreview: '#ebebeb' },
  { uid: 'vanilla',     name: 'Vanilla',     hexPreview: '#f5eeda' },
  { uid: 'lemon-tree',  name: 'Lemon Tree',  hexPreview: '#D4B483' },
  { uid: 'ivory',       name: 'Ivory',       hexPreview: '#f7f7f2' },
  { uid: 'devine-oak',  name: 'Devine Oak',  hexPreview: '#B8904A' },
  { uid: 'cloud-grey',  name: 'Cloud Grey',  hexPreview: '#f2f2f2' },
  { uid: 'polar-white', name: 'Polar White', hexPreview: '#FAFAFA' },
];

const wardrobeDoorInserts = [
  { uid: 'insert-mirror',            name: 'Mirror',            price: 118.19 },
  { uid: 'insert-white-decor-glass', name: 'White Decor Glass', price: 130.01 },
  { uid: 'insert-black-decor-glass', name: 'Black Decor Glass', price: 130.01 },
  { uid: 'insert-super-white-glass', name: 'Super White Glass', price: 165.47 },
];

const wardrobeStilesAndTracks = [
  { uid: 'stiles-tracks-silver',      name: 'Silver',      colour: '#dfdfdf', price: 0 },
  { uid: 'stiles-tracks-black',       name: 'Black',       colour: '#000000', price: 0 },
  { uid: 'stiles-tracks-matt-silver', name: 'Matt Silver', colour: '#C0C0C0', price: 0 },
  { uid: 'stiles-tracks-white',       name: 'White',       colour: '#FAFAFA', price: 0 },
  { uid: 'stiles-tracks-birch',       name: 'Birch',       colour: '#eecda2', price: 0 },
];

const wardrobeExtras = [
  {
    uid: 'extra-top-track',
    name: 'Top Track',
    price: 0,
    pricePerMetre: 25.97,
    maxQuantity: 1,
    defaultQuantity: null,
  },
  {
    uid: 'extra-bottom-track',
    name: 'Bottom Track',
    price: 0,
    pricePerMetre: 17.49,
    maxQuantity: 1,
    defaultQuantity: null,
  },
  {
    uid: 'extra-wall-channel',
    name: 'Wall Channel',
    price: 27.24,
    maxQuantity: 10,
    defaultQuantity: {
      WALL_TO_WALL: 2,
      WALL_TO_END_PANEL: 1,
      END_PANEL_TO_WALL: 1,
      END_PANEL_TO_END_PANEL: 0,
    },
  },
  {
    uid: 'extra-end-panel',
    name: 'End Panel',
    price: 90.6,
    maxQuantity: 10,
    defaultQuantity: {
      WALL_TO_WALL: 0,
      WALL_TO_END_PANEL: 1,
      END_PANEL_TO_WALL: 1,
      END_PANEL_TO_END_PANEL: 2,
    },
  },
  {
    uid: 'extra-16mm-end-panel-receiving-channel',
    name: '16mm End Panel Receiving Channel',
    price: 15.79,
    maxQuantity: 10,
    defaultQuantity: {
      WALL_TO_WALL: 0,
      WALL_TO_END_PANEL: 1,
      END_PANEL_TO_WALL: 1,
      END_PANEL_TO_END_PANEL: 2,
    },
  },
  {
    uid: 'extra-16mm-end-panel-return-channel',
    name: '16mm End Panel Return Channel',
    price: 39.75,
    maxQuantity: 10,
    defaultQuantity: {
      WALL_TO_WALL: 0,
      WALL_TO_END_PANEL: 1,
      END_PANEL_TO_WALL: 1,
      END_PANEL_TO_END_PANEL: 2,
    },
  },
];

// ── Seeder ────────────────────────────────────────────────────────────────────

type SeedCollection = {
  uid: string;
  contentType: string;
  data: Record<string, unknown>[];
};

const collections: SeedCollection[] = [
  { uid: 'wardrobe-types',                 contentType: 'api::wardrobe-type.wardrobe-type',                                           data: wardrobeTypes },
  { uid: 'wardrobe-width-ranges',          contentType: 'api::wardrobe-width-range.wardrobe-width-range',                             data: wardrobeWidthRanges },
  { uid: 'wardrobe-door-melamine-colours', contentType: 'api::wardrobe-door-melamine-colour.wardrobe-door-melamine-colour',           data: wardrobeDoorMelamineColours },
  { uid: 'wardrobe-door-inserts',          contentType: 'api::wardrobe-door-insert.wardrobe-door-insert',                             data: wardrobeDoorInserts },
  { uid: 'wardrobe-stiles-and-tracks',     contentType: 'api::wardrobe-stiles-and-tracks.wardrobe-stiles-and-tracks',                 data: wardrobeStilesAndTracks },
  { uid: 'wardrobe-extras',               contentType: 'api::wardrobe-extra.wardrobe-extra',                                         data: wardrobeExtras },
];

export const seedCatalogueData = async (strapi: Core.Strapi) => {
  strapi.log.info('[Seed] Checking catalogue data...');

  for (const collection of collections) {
    const existing = await strapi.entityService.findMany(
      collection.contentType as any,
      { limit: 1 }
    );

    // Skip if already seeded — never overwrite
    if (existing && (existing as any[]).length > 0) {
      strapi.log.info(`[Seed] ${collection.uid} already seeded — skipping`);
      continue;
    }

    // Insert all records
    for (const record of collection.data) {
      await strapi.entityService.create(collection.contentType as any, {
        data: record as any,
      });
    }

    strapi.log.info(`[Seed] ${collection.uid} seeded (${collection.data.length} records)`);
  }

  strapi.log.info('[Seed] Catalogue seed complete ✅');
};

