import { factories } from '@strapi/strapi';
import { calculatePrice } from '../../../pricing/wardrobePricing';

export default factories.createCoreService('api::wardrobe-configuration.wardrobe-configuration', ({ strapi }) => ({

  async saveConfiguration(data: any) {
    // 1. Fetch all referenced entities for price recalculation
    const [wardrobeType, widthRange, stilesAndTracks] = await Promise.all([
      strapi.entityService.findMany('api::wardrobe-type.wardrobe-type' as any, {
        filters: { uid: data.wardrobeTypeId },
        limit: 1,
      }),
      strapi.entityService.findMany('api::wardrobe-width-range.wardrobe-width-range' as any, {
        filters: { uid: data.wardrobeSelectedRangeId },
        limit: 1,
      }),
      strapi.entityService.findMany('api::wardrobe-stiles-and-tracks.wardrobe-stiles-and-tracks' as any, {
        filters: { uid: data.wardrobeStilesAndTracksId },
        limit: 1,
      }),
    ]);

    // 2. Fetch door inserts for each door configuration
    const doorInserts = await Promise.all(
      (data.wardrobeDoorConfigurations ?? []).map(async (door: any) => {
        if (!door.insertId) return { doorIndex: door.doorIndex, insert: null };
        const inserts = await strapi.entityService.findMany(
          'api::wardrobe-door-insert.wardrobe-door-insert' as any,
          { filters: { uid: door.insertId }, limit: 1 }
        );
        return {
          doorIndex: door.doorIndex,
          insert: (inserts as any[])[0] ?? null,
        };
      })
    );

    // 3. Fetch extras
    const extrasWithPrices = await Promise.all(
      Object.entries(data.wardrobeSelectedExtras ?? {}).map(async ([extraId, quantity]) => {
        const extras = await strapi.entityService.findMany(
          'api::wardrobe-extra.wardrobe-extra' as any,
          { filters: { uid: extraId }, limit: 1 }
        );
        const extra = (extras as any[])[0];
        return { id: extraId, price: extra?.price ?? 0, quantity: quantity as number };
      })
    );

    // 4. Recalculate price server-side
    const priceBreakdown = calculatePrice({
      wardrobeType: (wardrobeType as any[])[0] ?? { price: 0 },
      widthRange: (widthRange as any[])[0] ?? { doorCountPrices: {} },
      doorCount: data.wardrobeDoorCount,
      doorInserts,
      stilesAndTracks: (stilesAndTracks as any[])[0] ?? { price: 0 },
      extras: extrasWithPrices,
    });

    // 5. Save configuration with server-calculated price
    const configuration = await strapi.entityService.create(
      'api::wardrobe-configuration.wardrobe-configuration' as any,
      {
        data: {
          ...data,
          priceBreakdown,
          estimatedPrice: priceBreakdown.total,
          status: 'draft',
        },
      }
    );

    return { configuration, priceBreakdown };
  },

  async findBySession(sessionId: string) {
    const configurations = await strapi.entityService.findMany(
      'api::wardrobe-configuration.wardrobe-configuration' as any,
      {
        filters: { sessionId },
        sort: { createdAt: 'desc' },
      }
    );
    return configurations;
  },
}));