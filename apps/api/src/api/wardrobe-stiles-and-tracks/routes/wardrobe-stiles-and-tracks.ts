export default {
  routes: [
    {
      method: 'GET',
      path: '/stiles-and-tracks',
      handler: 'wardrobe-stiles-and-tracks.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};