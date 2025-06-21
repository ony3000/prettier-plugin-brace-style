import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'try...catch',
    input: `
<script lang="ts">
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
</script>
`,
  },
  {
    name: 'try...finally',
    input: `
<script lang="ts">
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
</script>
`,
  },
  {
    name: 'try...catch...finally',
    input: `
<script lang="ts">
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
</script>
`,
  },
  {
    name: 'nested try',
    input: `
<script lang="ts">
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
</script>
`,
  },
];
