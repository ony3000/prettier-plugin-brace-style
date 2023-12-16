import type { Fixture } from '../../settings';
import { format, baseOptions, allmanLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'ignore comment #1',
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
    output: `/* eslint-disable brace-style */
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
/* eslint-enable brace-style */
`,
  },
  {
    name: 'ignore comment #2',
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
    output: `/* eslint-disable brace-style */
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
/* eslint-enable brace-style */
`,
  },
  {
    name: 'ignore comment #3',
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
    output: `/* eslint-disable brace-style */
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
    name: 'ignore comment #4',
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
    output: `export function MyComponent()
{
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
    output: `export function MyComponent()
{
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

describe('babel/prettier-ignore/allman', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await allmanLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
