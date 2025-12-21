import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'for',
    input: `
---
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
---

<script>
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
</script>
`,
  },
  {
    name: 'for...in',
    input: `
---
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
---

<script>
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
</script>
`,
  },
  {
    name: 'for...of',
    input: `
---
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
---

<script>
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
</script>
`,
  },
  {
    name: 'for await...of',
    input: `
---
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
---

<script>
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
</script>
`,
  },
];
