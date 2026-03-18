import { factories } from '@strapi/strapi';
import { cache } from '../../../services/cache';
import { transformCollection } from '../../../utils/transformers';

const CACHE_KEY = 'catalogue:wardrobe-types';

export default factories.createCoreService('api::wardrobe-type.wardrobe-type', ({ strapi }) => ({
  async findAll() {
    // 1. Check cache first
    const cached = await cache.get(CACHE_KEY);
    if (cached) return cached;

    // 2. Cache miss — fetch from PostgreSQL
    const entities = await strapi.entityService.findMany(
      'api::wardrobe-type.wardrobe-type',
      {
        populate: ['image'],
        sort: { id: 'asc' },
      }
    );

    // 3. Transform to frontend shape
    const result = transformCollection(entities as any[]);

    // 4. Store in Redis for 1 hour
    await cache.set(CACHE_KEY, result);

    return result;
  },
}));