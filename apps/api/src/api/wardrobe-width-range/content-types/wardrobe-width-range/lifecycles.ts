import { cache } from '../../../../services/cache';

export default {
  async afterCreate() { await cache.invalidate('catalogue:width-ranges'); },
  async afterUpdate() { await cache.invalidate('catalogue:width-ranges'); },
  async afterDelete() { await cache.invalidate('catalogue:width-ranges'); },
};