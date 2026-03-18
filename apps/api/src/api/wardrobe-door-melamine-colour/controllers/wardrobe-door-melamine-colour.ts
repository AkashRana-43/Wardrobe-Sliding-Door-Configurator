import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-door-melamine-colour.wardrobe-door-melamine-colour', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-door-melamine-colour.wardrobe-door-melamine-colour') as any;
    const data = await service.findAll();
    ctx.body = data;
  },
}));