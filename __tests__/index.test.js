const withCustomConfig = require('../');

const BABEL_CONFIG_PATH = '../babel.config.js';

it('throws with no babelConfigFile', () => {
  const { webpack } = withCustomConfig({});
  expect(() => {
    webpack()
  }).toThrow('No babelConfigFile option found. Please add babelConfigFile to your next.config.js, for example: withMonorepo({ babelConfigFile: path.resolve("../babel.config.js") })')
});

it('adds the config when use is an object', () => {
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

it('adds the config when use is an array', () => {
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
        }
      ],
    }
  }
  const webpackConfig = webpack(config);
  expect(webpackConfig.module.rules[0].use[1].options.configFile).toBe(BABEL_CONFIG_PATH)
});
