# Next.js + Custom babel config file

Adds the ability to supply a custom `babel.config.js` to next.js projects. Useful if you wish to use a monorepo / yarn workspaces project setup in combination with next.js where a shared `babel.config.js` is used. [More reading](https://babeljs.io/docs/en/config-files#project-wide-configuration)

> This plugin is intended to be used with next.js > 7.0.0

If you like it, give it a [star](https://github.com/josephluck/next-plugin-custom-babel-config)!

## Installation

```
npm install --save next-plugin-custom-babel-config
```

or

```
yarn add next-plugin-custom-babel-config
```

## Usage

Given the directory structure:

```
- api-workspace
 ㄴ index.js
 ㄴ package.json
- ui-workspace
 ㄴ pages
 ㄴ next.config.js
 ㄴ package.json
- babel.config.js
- package.json
```

Wrap your config in the plugin in your `next.config.js` file:

```js
// ui/next.config.js
const path = require("path");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");

module.exports = withCustomBabelConfigFile({
  babelConfigFile: path.resolve("../babel.config.js")
});
```

## I need to transpile my workspaces

If you want to import source files from your workspaces, or need to transpile any files inside `node_modules`, Use the handy `next-plugin-transpile-modules` package in conjunction with this one as follows:

```js
// ui/next.config.js
const path = require("path");
const withTranspileModules = require("next-plugin-transpile-modules");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");

module.exports = withCustomBabelConfigFile(
  withTranspileModules({
    transpileModules: ["@org/api-workspace"],
    babelConfigFile: path.resolve("../babel.config.js")
  })
);
```
