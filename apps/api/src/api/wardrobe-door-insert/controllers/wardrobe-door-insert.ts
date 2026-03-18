import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-door-insert.wardrobe-door-insert', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-door-insert.wardrobe-door-insert') as any;
    const data = await service.findAll();
    ctx.body = data;
  },
}));