import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-configuration.wardrobe-configuration', ({ strapi }) => ({

  async create(ctx) {
    const body = ctx.request.body as any;

    // Basic validation
    if (!body.wardrobeTypeId || !body.wardrobeSelectedRangeId || !body.wardrobeDoorCount) {
      return ctx.badRequest('Missing required configuration fields');
    }

    if (!body.sessionId) {
      return ctx.badRequest('sessionId is required');
    }

    const service = strapi.service('api::wardrobe-configuration.wardrobe-configuration') as any;
    const result = await service.saveConfiguration(body);

    ctx.body = result;
  },

  async findBySession(ctx) {
    const { sessionId } = ctx.params;

    if (!sessionId) {
      return ctx.badRequest('sessionId is required');
    }

    const service = strapi.service('api::wardrobe-configuration.wardrobe-configuration') as any;
    const configurations = await service.findBySession(sessionId);

    ctx.body = configurations;
  },
}));