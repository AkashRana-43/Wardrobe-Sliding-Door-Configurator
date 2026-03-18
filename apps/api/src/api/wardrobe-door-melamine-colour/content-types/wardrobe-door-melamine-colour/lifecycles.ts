import { cache } from '../../../../services/cache';

export default {
  async afterCreate() { await cache.invalidate('catalogue:melamine-colours'); },
  async afterUpdate() { await cache.invalidate('catalogue:melamine-colours'); },
  async afterDelete() { await cache.invalidate('catalogue:melamine-colours'); },
};