/**
 * Transforms a Strapi media object into the shape the frontend expects.
 */
export const transformImage = (image: any) => {
  if (!image) return null;
  return {
    url: image.url,
    alternativeText: image.alternativeText ?? '',
  };
};

/**
 * Transforms a single Strapi entity into a frontend-ready object.
 * - Replaces Strapi's internal integer id with our semantic uid
 * - Transforms media fields
 * - Strips Strapi internal fields (createdAt, updatedAt, publishedAt)
 */
export const transformEntity = (entity: any, imageFields: string[] = ['image']) => {
  if (!entity) return null;

  const { id, uid, ...rest } = entity;

  // Transform all media fields
  const transformed: any = { ...rest };
  for (const field of imageFields) {
    if (transformed[field] !== undefined) {
      transformed[field] = transformImage(transformed[field]);
    }
  }

  // Strip Strapi internal fields
  delete transformed.createdAt;
  delete transformed.updatedAt;
  delete transformed.publishedAt;
  delete transformed.locale;
  delete transformed.documentId; 

  return {
    id: uid,           // semantic id the frontend expects
    ...transformed,
  };
};

/**
 * Transforms a Strapi collection response (array) into a flat frontend-ready array.
 */
export const transformCollection = (entities: any[], imageFields: string[] = ['image']) => {
  if (!Array.isArray(entities)) return [];
  return entities.map(entity => transformEntity(entity, imageFields));
};