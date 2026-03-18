import { factories } from '@strapi/strapi';
import { cache } from '../../../services/cache';
import { transformCollection } from '../../../utils/transformers';

const CACHE_KEY = 'catalogue:melamine-colours';

export default factories.createCoreService('api::wardrobe-door-melamine-colour.wardrobe-door-melamine-colour', ({ strapi }) => ({
  async findAll() {
    const cached = await cache.get(CACHE_KEY);
    if (cached) return cached;

    const entities = await strapi.entityService.findMany(
      'api::wardrobe-door-melamine-colour.wardrobe-door-melamine-colour',
      {
        populate: ['image'],
        sort: { id: 'asc' },
      }
    );

    const result = transformCollection(entities as any[]);
    await cache.set(CACHE_KEY, result);
    return result;
  },
}));