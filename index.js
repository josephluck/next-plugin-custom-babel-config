function isBabelLoader (loader) {
  return loader && (
    loader === 'next-babel-loader' ||
    // Next.js 11 uses an absolute path to its loader
    loader.replace(/\\/g, '/').match('/next/dist/build/babel/loader/index.js$')
  );
}

function isSwcLoader (loader) {
  return loader && loader === 'next-swc-loader';
}

function processRules (rules, nextConfig, foundLoaders) {
  rules.forEach((rule) => {
    if (rule.use) {
      if (Array.isArray(rule.use)) {
        const babelLoader = rule.use.find(use => typeof use === 'object' && isBabelLoader(use.loader));
        if (babelLoader && babelLoader.options) {
          foundLoaders.babel = true;
          babelLoader.options.configFile = nextConfig.babelConfigFile;
        }
      } else if (isBabelLoader(rule.use.loader)) {
        foundLoaders.babel = true;
        rule.use.options.configFile = nextConfig.babelConfigFile;
      } else if (isSwcLoader(rule.use.loader)) {
        foundLoaders.swc = true;
      }
    }
    if (rule.oneOf) {
      processRules(rule.oneOf, nextConfig, foundLoaders);
    }
  });
}

module.exports = function (nextConfig) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!nextConfig.babelConfigFile) {
        throw new Error('No babelConfigFile option found. Please add babelConfigFile to your next.config.js, for example: withMonorepo({ babelConfigFile: path.resolve("../babel.config.js") })');
      }

      const foundLoaders = {};
      processRules(config.module.rules, nextConfig, foundLoaders);
      if (!foundLoaders.babel) {
        if (foundLoaders.swc) {
          throw new Error('Next.js is currently using its SWC loader instead of the Babel loader. Please add an empty .babelrc file to your Next.js root directory to make it use the Babel loader.');
        }
        console.error('Warning: Could not find any Babel loader to configure. Please ensure that you are using the latest version of next-plugin-custom-babel-config and a supported version of Next.js.');
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
