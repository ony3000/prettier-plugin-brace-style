# prettier-plugin-brace-style

A Prettier plugin that can apply ESLint's [brace-style](https://github.com/eslint/eslint/blob/v8.35.0/docs/src/rules/brace-style.md) rules to JavaScript and TypeScript files.

## Installation

```sh
npm install --save-dev prettier@~2.8 prettier-plugin-brace-style
```

## Configuration

**Notice**: This plugin should be added as the last element of the `plugins` array. May not be compatible with other plugins.

JSON:

```json
{
  "plugins": ["prettier-plugin-brace-style"]
}
```

JS:

```javascript
module.exports = {
  plugins: [require('prettier-plugin-brace-style')],
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
