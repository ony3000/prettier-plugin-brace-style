import { ESLint } from 'eslint';

export const oneTBSLinter = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'brace-style': ['error', '1tbs'],
    },
  },
});

export const allmanLinter = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'brace-style': ['error', 'allman'],
    },
  },
});

export const stroustrupLinter = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'brace-style': ['error', 'stroustrup'],
    },
  },
});
