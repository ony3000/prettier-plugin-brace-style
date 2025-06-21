import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: "(1) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`jsx
<div />;
\`\`\`
`,
    options: {},
  },
  {
    name: "(2) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`jsx
import foo from 'foo'

<div />
\`\`\`
`,
    options: {},
  },
  {
    name: "(3) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`jsx
if (foo) { bar(); } else { baz(); }
\`\`\`
`,
    options: {},
  },
  {
    name: "(4) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`tsx
<div />;
\`\`\`
`,
    options: {},
  },
  {
    name: "(5) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`tsx
import foo from 'foo'

<div />
\`\`\`
`,
    options: {},
  },
  {
    name: "(6) This plugin doesn't support markdown parser, so it leaves Prettier's output as is.",
    input: `
\`\`\`tsx
if (foo) { bar(); } else { baz(); }
\`\`\`
`,
    options: {},
  },
];
