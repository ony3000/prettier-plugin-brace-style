import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `/* eslint-disable brace-style */
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
/* eslint-enable brace-style */`,
  },
  {
    name: 'ignore comment (2)',
    input: `/* eslint-disable brace-style */
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
/* eslint-enable brace-style */`,
  },
  {
    name: 'ignore comment (3)',
    input: `
/* eslint-disable brace-style */
// prettier-ignore
export function MyComponent() {
  return (
    <div>
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
    </div>
  );
}
/* eslint-enable brace-style */
`,
  },
  {
    name: 'ignore comment (4)',
    input: `
export function MyComponent() {
  return (
    <div>
      {/* eslint-disable brace-style */}
      {/* prettier-ignore */}
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
      {/* eslint-enable brace-style */}
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
    </div>
  );
}
`,
  },
  {
    name: 'ignore comment (5)',
    input: `
export function MyComponent() {
  return (
    <div>
      <button
        type="button"
        /* eslint-disable brace-style */
        // prettier-ignore
        onClick={() => {}}
        /* eslint-enable brace-style */
      >
        Click me
      </button>
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
    </div>
  );
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
/**
 * prettier-ignore
 */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
// /* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
`,
  },
];
