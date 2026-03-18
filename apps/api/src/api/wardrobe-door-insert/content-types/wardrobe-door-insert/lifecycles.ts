import { cache } from '../../../../services/cache';

export default {
  async afterCreate() { await cache.invalidate('catalogue:door-inserts'); },
  async afterUpdate() { await cache.invalidate('catalogue:door-inserts'); },
  async afterDelete() { await cache.invalidate('catalogue:door-inserts'); },
};