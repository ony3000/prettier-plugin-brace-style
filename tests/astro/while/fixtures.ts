import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'while',
    input: `
---
let n = 0;

while (n < 3) {
  n++;
}
---

<script>
let n = 0;

while (n < 3) {
  n++;
}
</script>
`,
  },
  {
    name: 'do...while',
    input: `
---
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
---

<script>
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>
`,
  },
];
