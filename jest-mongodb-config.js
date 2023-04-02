module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '5.0.13',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
