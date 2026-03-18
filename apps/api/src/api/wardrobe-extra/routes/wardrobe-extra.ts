export default {
  routes: [
    {
      method: 'GET',
      path: '/extras',
      handler: 'wardrobe-extra.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};