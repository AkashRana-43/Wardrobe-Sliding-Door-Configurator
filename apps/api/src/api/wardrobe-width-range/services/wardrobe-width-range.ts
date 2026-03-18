import { factories } from '@strapi/strapi';
import { cache } from '../../../services/cache';
import { transformCollection } from '../../../utils/transformers';

const CACHE_KEY = 'catalogue:width-ranges';

export default factories.createCoreService('api::wardrobe-width-range.wardrobe-width-range', ({ strapi }) => ({
  async findAll() {
    const cached = await cache.get(CACHE_KEY);
    if (cached) return cached;

    const entities = await strapi.entityService.findMany(
      'api::wardrobe-width-range.wardrobe-width-range',
      { sort: { minWidthMm: 'asc' } }
    );

    // Width ranges have no image field
    const result = transformCollection(entities as any[], []);

    await cache.set(CACHE_KEY, result);
    return result;
  },
}));