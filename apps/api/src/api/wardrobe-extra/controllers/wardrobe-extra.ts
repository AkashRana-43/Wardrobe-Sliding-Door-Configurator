import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-extra.wardrobe-extra', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-extra.wardrobe-extra') as any;
    const data = await service.findAll();
    ctx.body = data;
  },
}));