import { cache } from '../../../../services/cache';

export default {
  async afterCreate() { await cache.invalidate('catalogue:stiles-and-tracks'); },
  async afterUpdate() { await cache.invalidate('catalogue:stiles-and-tracks'); },
  async afterDelete() { await cache.invalidate('catalogue:stiles-and-tracks'); },
};