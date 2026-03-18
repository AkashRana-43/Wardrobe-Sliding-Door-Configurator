export default {
  routes: [
    {
      method: 'GET',
      path: '/melamine-colours',
      handler: 'wardrobe-door-melamine-colour.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};