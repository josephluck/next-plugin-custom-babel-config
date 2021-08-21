const path = require('path');

function isBabelLoader (loader) {
  return loader && (
    loader === 'next-babel-loader' ||
	// Next.js 11 uses an absolute path to its loader
    loader.replace(/\\/g, '/').match('/next/dist/build/babel/loader/index.js$')
  )
}

module.exports = function (nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!nextConfig.babelConfigFile) {
        throw new Error('No babelConfigFile option found. Please add babelConfigFile to your next.config.js, for example: withMonorepo({ babelConfigFile: path.resolve("../babel.config.js") })')
      }
      config.module.rules.forEach((rule) => {
        if (rule.use) {
          if (Array.isArray(rule.use)) {
            const babelLoader = rule.use.find(use => typeof use === 'object' && isBabelLoader(use.loader));
            if (babelLoader && babelLoader.options) {
              babelLoader.options.configFile = nextConfig.babelConfigFile;
            }
          } else if (isBabelLoader(rule.use.loader)) {
            rule.use.options.configFile = nextConfig.babelConfigFile;
          }
        }
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
