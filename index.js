const path = require('path');

module.exports = function(nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!nextConfig.babelConfigFile) {
        throw new Error('No babelConfigFile option found. Please add babelConfigFile to your next.config.js, for example: withMonorepo({ babelConfigFile: path.resolve("../babel.config.js") })')
      }
      config.module.rules.forEach((rule) => {
        if (rule.use && rule.use.loader === 'next-babel-loader') {
          rule.use.options.configFile = nextConfig.babelConfigFile;
        }
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
