import type { SupportOptions } from 'prettier';

export const options: SupportOptions = {
  braceStyle: {
    // @ts-ignore
    since: '0.1.0',
    type: 'choice',
    category: 'Format',
    default: '1tbs',
    description: 'Enforces consistent brace style for blocks.',
    choices: [
      {
        value: '1tbs',
        description: 'one true brace style',
      },
      {
        value: 'stroustrup',
        description: 'Stroustrup style',
      },
      {
        value: 'allman',
        description: 'Allman style',
      },
    ],
  },
};
