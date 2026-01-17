import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}`,
  },
  {
    name: 'ignore comment (2)',
    input: `/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}`,
  },
  {
    name: 'ignore comment (3)',
    input: `
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
`,
  },
  {
    name: 'ignore comment (4)',
    input: `
export function MyComponent() {
  return (
    <div>
      {/* prettier-ignore */}
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
        // prettier-ignore
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
