import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-width-range.wardrobe-width-range', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-width-range.wardrobe-width-range') as any;
    const data = await service.findAll();
    ctx.body = data;
  },
}));