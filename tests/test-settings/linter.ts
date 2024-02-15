import { ESLint } from 'eslint';

export const oneTBSLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', '1tbs'],
    },
  },
});

export const allmanLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', 'allman'],
    },
  },
});

export const stroustrupLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', 'stroustrup'],
    },
  },
});
