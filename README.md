# prettier-plugin-brace-style

A Prettier plugin that can apply ESLint's [brace-style](https://github.com/eslint/eslint/blob/v8.35.0/docs/src/rules/brace-style.md) rules to JavaScript and TypeScript files.

## Installation

```sh
npm install --save-dev prettier@~2.8 prettier-plugin-brace-style
```

```sh
yarn add --dev prettier@~2.8 prettier-plugin-brace-style
```

```sh
pnpm add --save-dev prettier@~2.8 prettier-plugin-brace-style
```

## Configuration

If this is the only prettier plugin you are using, it will be loaded automatically so you only need to set the [options](#options).

If you want to use this plugin with other prettier plugins, I recommend taking the help of [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).

JSON:

```json
{
  "plugins": [
    "OTHER_PRETTIER_PLUGIN_1",
    "OTHER_PRETTIER_PLUGIN_2",
    "prettier-plugin-brace-style",
    "prettier-plugin-merge"
  ]
}
```

JS:

```javascript
module.exports = {
  plugins: [
    require('OTHER_PRETTIER_PLUGIN_1'),
    require('OTHER_PRETTIER_PLUGIN_2'),
    require('prettier-plugin-brace-style'),
    require('prettier-plugin-merge'),
  ],
};
```

## Options

This plugin has only one option, `braceStyle`. [Same as ESLint](https://github.com/eslint/eslint/blob/v8.35.0/docs/src/rules/brace-style.md#options), you can select one of `1tbs` (default), `stroustrup`, `allman`.

CLI Override:

```
--brace-style <1tbs|stroustrup|allman>
```

API Override:

```
braceStyle: '1tbs' | 'stroustrup' | 'allman'
```
