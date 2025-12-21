import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'try...catch',
    input: `
---
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
---

<script>
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
---
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
---

<script>
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
---
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
---

<script>
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
---
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
---

<script>
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
