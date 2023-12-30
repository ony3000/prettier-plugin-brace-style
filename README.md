# prettier-plugin-brace-style

A Prettier plugin that can apply ESLint's [brace-style](https://eslint.org/docs/latest/rules/brace-style) rules.

## Installation

For Prettier v2:

```sh
npm install -D prettier@^2 prettier-plugin-brace-style
```

For Prettier v3:

```sh
npm install -D prettier prettier-plugin-brace-style @prettier/sync
```

## Configuration

JSON:

```json
{
  "plugins": ["prettier-plugin-brace-style"],
  "braceStyle": "1tbs"
}
```

JS (CommonJS module):

```javascript
module.exports = {
  plugins: ['prettier-plugin-brace-style'],
  braceStyle: '1tbs',
};
```

JS (ES module):

```javascript
export default {
  plugins: ['prettier-plugin-brace-style'],
  braceStyle: '1tbs',
};
```

## Options

This plugin has only one option, `braceStyle`. Same as ESLint, you can select one of `1tbs` (default), `stroustrup`, `allman`.

<!-- prettier-ignore -->
Option&nbsp;value | Description | Example&nbsp;code
--- | --- | ---
`1tbs` | the opening brace of a block is placed on the same line as its corresponding statement or declaration. | ![example code of 1tbs option](.github/1tbs.png)
`stroustrup` | the `else` statements in an `if-else` construct, as well as `catch` and `finally`, must be on its own line after the preceding closing brace. | ![example code of stroustrup option](.github/stroustrup.png)
`allman` | all the braces are expected to be on their own lines without any extra indentation. | ![example code of allman option](.github/allman.png)

## Compatibility with other Prettier plugins

If more than one Prettier plugin can handle the text you want to format, Prettier will only use the last of those plugins.

In this case, you can configure it as follows by adding [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge) to apply those plugins sequentially.

JSON example:

<!-- prettier-ignore -->
```json
{
  "plugins": [
    "another-prettier-plugin",
    "prettier-plugin-brace-style",
    "prettier-plugin-merge"
  ],
  "braceStyle": "stroustrup"
}
```
