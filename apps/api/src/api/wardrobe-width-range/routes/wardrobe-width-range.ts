export default {
  routes: [
    {
      method: 'GET',
      path: '/width-ranges',
      handler: 'wardrobe-width-range.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};