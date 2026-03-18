import type { Core } from '@strapi/strapi';
import { seedCatalogueData } from './seed/catalogueSeeder';

export default {
  async register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedCatalogueData(strapi);
  },
};