export default {
  routes: [
    {
      method: 'GET',
      path: '/door-inserts',
      handler: 'wardrobe-door-insert.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};