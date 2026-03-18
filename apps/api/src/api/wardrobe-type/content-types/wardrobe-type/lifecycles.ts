import { cache } from '../../../../services/cache';

export default {
  async afterCreate() {
    await cache.invalidate('catalogue:wardrobe-types');
  },
  async afterUpdate() {
    await cache.invalidate('catalogue:wardrobe-types');
  },
  async afterDelete() {
    await cache.invalidate('catalogue:wardrobe-types');
  },
};