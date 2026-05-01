const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    // Escaping the dots and defining patterns to ignore
    blockList: [
      /.*\.vs\/.*/,
      /.*Backend\/.*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);