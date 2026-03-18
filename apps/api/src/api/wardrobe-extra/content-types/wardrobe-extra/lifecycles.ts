import { cache } from '../../../../services/cache';

export default {
  async afterCreate() { await cache.invalidate('catalogue:extras'); },
  async afterUpdate() { await cache.invalidate('catalogue:extras'); },
  async afterDelete() { await cache.invalidate('catalogue:extras'); },
};