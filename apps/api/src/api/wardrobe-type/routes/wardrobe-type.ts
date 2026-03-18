export default {
  routes: [
    {
      method: 'GET',
      path: '/wardrobe-types',
      handler: 'wardrobe-type.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};