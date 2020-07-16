module.exports = {
  jest: function(config) {
    return {
      ...config,
      snapshotSerializers: ["enzyme-to-json/serializer"],
      setupFilesAfterEnv: [require.resolve("./jest.setup.js")],
    };
  },
};
