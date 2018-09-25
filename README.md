# Next.js + Custom babel config file

Adds the ability to supply a custom `babel.config.js` to next.js projects. Useful if you wish to use a monorepo / yarn workspaces project setup in combination with next.js.

> This plugin intends to be used with next.js > 7.0.0

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

```js
// ui/next.config.js
const path = require('path');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');

module.exports = withCustomBabelConfigFile({
  babelConfigFile: path.resolve('../babel.config.js')
});
```

## I need to transpile my workspaces

Use the handy `next-plugin-transpile-modules` package as follows:

```js
// ui/next.config.js
const path = require('path');
const withTranspileModules = require('next-plugin-transpile-modules');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');

module.exports = withCustomBabelConfigFile(
  withTranspileModules({
    transpileModules: ['@org', 'another_module'],
    babelConfigFile: path.resolve('../babel.config.js')
  })
);
```
