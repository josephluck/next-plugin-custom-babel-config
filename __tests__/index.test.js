const withCustomConfig = require('../');

const BABEL_CONFIG_PATH = '../babel.config.js';

it('throws with no babelConfigFile', () => {
  const { webpack } = withCustomConfig({});
  expect(() => {
    webpack()
  }).toThrow('No babelConfigFile option found. Please add babelConfigFile to your next.config.js, for example: withMonorepo({ babelConfigFile: path.resolve("../babel.config.js") })')
});

it('throws if SWC loader is being used instead of Babel', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [{
        use: {
          loader: 'next-swc-loader',
          options: {},
        },
      }],
    }
  }
  expect(() => {
    webpack(config)
  }).toThrow(/SWC loader/)
});

it('adds the config when use is an object - Next.js < 11', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [{
        use: {
          loader: 'next-babel-loader',
          options: {},
        },
      }],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].use.options.configFile).toBe(BABEL_CONFIG_PATH)
});

it('adds the config when use is an object - Next.js 11', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [
        {
          use: {
            loader: '/absolute/path/to/project/node_modules/next/dist/build/babel/loader/index.js',
            options: {},
          },
        },
        {
          use: {
            loader: 'C:\\path\\on\\Windows\\node_modules\\next\\dist\\build\\babel\\loader\\index.js',
            options: {},
          },
        },
      ],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].use.options.configFile).toBe(BABEL_CONFIG_PATH)
  expect(webpackConfig.module.rules[1].use.options.configFile).toBe(BABEL_CONFIG_PATH)
});

it('adds the config when use is an object nested in a oneOf array - Next.js 12', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [
        {
          oneOf: [
            {
              use: {
                loader: '/absolute/path/to/project/node_modules/next/dist/build/babel/loader/index.js',
                options: {},
              },
            },
            {
              use: {
                loader: 'C:\\path\\on\\Windows\\node_modules\\next\\dist\\build\\babel\\loader\\index.js',
                options: {},
              },
            },
          ]
        },
      ],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].oneOf[0].use.options.configFile).toBe(BABEL_CONFIG_PATH)
  expect(webpackConfig.module.rules[0].oneOf[1].use.options.configFile).toBe(BABEL_CONFIG_PATH)
});

it('adds the config when use is an array - Next.js < 11', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [
        {
          use: [
            'some-other-loader',
            {
              loader: 'next-babel-loader',
              options: {},
            },
          ],
        },
        {
          use: [
            'css-loader',
            {
              loader: 'next-css-loader',
              options: {},
            },
          ],
        },
      ],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].use[1].options.configFile).toBe(BABEL_CONFIG_PATH)
  // Ensure the non-babel loader has not been touched
  expect(webpackConfig.module.rules[1].use[1].options.configFile).toBe(undefined)
});

it('adds the config when use is an array - Next.js 11', () => {
  const { webpack } = withCustomConfig({ babelConfigFile: BABEL_CONFIG_PATH });
  const config = {
    module: {
      rules: [
        {
          use: [
            'some-other-loader',
            {
              loader: '/absolute/path/to/project/node_modules/next/dist/build/babel/loader/index.js',
              options: {},
            },
          ],
        },
        {
          use: [
            'yet-another-loader',
            {
              loader: 'C:\\path\\on\\Windows\\node_modules\\next\\dist\\build\\babel\\loader\\index.js',
              options: {},
            },
          ],
        },
        {
          use: [
            'css-loader',
            {
              loader: 'next-css-loader',
              options: {},
            },
          ],
        }
      ],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].use[1].options.configFile).toBe(BABEL_CONFIG_PATH)
  expect(webpackConfig.module.rules[1].use[1].options.configFile).toBe(BABEL_CONFIG_PATH)
  // Ensure the non-babel loader has not been touched
  expect(webpackConfig.module.rules[2].use[1].options.configFile).toBe(undefined)
});
