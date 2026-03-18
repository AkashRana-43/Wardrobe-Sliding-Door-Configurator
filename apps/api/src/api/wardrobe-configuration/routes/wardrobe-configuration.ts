export default {
  routes: [
    {
      method: 'POST',
      path: '/configurations',
      handler: 'wardrobe-configuration.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/configurations/:sessionId',
      handler: 'wardrobe-configuration.findBySession',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};