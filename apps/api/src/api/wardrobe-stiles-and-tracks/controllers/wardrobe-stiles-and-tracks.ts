import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wardrobe-stiles-and-tracks.wardrobe-stiles-and-tracks', ({ strapi }) => ({
  async find(ctx) {
    const service = strapi.service('api::wardrobe-stiles-and-tracks.wardrobe-stiles-and-tracks') as any;
    const data = await service.findAll();
    ctx.body = data;
  },
}));