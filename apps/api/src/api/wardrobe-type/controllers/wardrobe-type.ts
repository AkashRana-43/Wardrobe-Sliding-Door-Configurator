import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-type.wardrobe-type', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-type.wardrobe-type') as any;
    const data = await service.findAll();

    ctx.body = data; // flat array — not Strapi's paginated envelope
  },
}));