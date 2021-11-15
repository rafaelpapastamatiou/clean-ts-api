module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "5.0.3",
      skipMD5: true,
    },
    autoStart: true,
    instance: {
      dbName: "jest",
    },
  },
};
