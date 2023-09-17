import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'ignore comment #1',
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
    output: `// prettier-ignore
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
    name: 'ignore comment #2',
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
    output: `/* prettier-ignore */
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
    name: 'ignore comment #3',
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
    output: `// prettier-ignore
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
    name: 'ignore comment #4',
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
    output: `export function MyComponent()
{
  return (
    <div>
      {/* prettier-ignore */}
      <button
        type="button"
        onClick={() => {}}
      >
        Click me
      </button>
      <button type="button" onClick={() =>
      {}}>
        Click me
      </button>
    </div>
  );
}
`,
  },
  {
    name: 'ignore comment #5',
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
    output: `export function MyComponent()
{
  return (
    <div>
      <button
        type="button"
        // prettier-ignore
        onClick={() => {}}
      >
        Click me
      </button>
      <button type="button" onClick={() =>
      {}}>
        Click me
      </button>
    </div>
  );
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting #1',
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
    output: `/**
 * prettier-ignore
 */
if (condition1)
{
  foo;
}
else if (condition2)
{
  bar;
}
else
{
  baz;
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting #2',
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
    output: `// /* prettier-ignore */
if (condition1)
{
  foo;
}
else if (condition2)
{
  bar;
}
else
{
  baz;
}
`,
  },
];

describe('typescript/prettier-ignore/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
