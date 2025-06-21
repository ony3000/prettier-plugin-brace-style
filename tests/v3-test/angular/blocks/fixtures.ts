import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '@defer block',
    input: `
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder</p>
} @loading {
  <img alt="loading image" src="loading.gif" />
} @error {
  <p>An loading error occurred</p>
}
`,
  },
  {
    name: '@defer block with triggers and parameters',
    input: `
@defer (on timer(500ms); prefetch on idle) {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder</p>
} @loading (after 100ms; minimum 1s) {
  <img alt="loading image" src="loading.gif" />
} @error {
  <p>An loading error occurred</p>
}
`,
  },
  {
    name: '@for block',
    input: `
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
`,
  },
  {
    name: '@if block',
    input: `
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
`,
  },
  {
    name: '@switch block',
    input: `
@switch (condition) {
  @case (caseA) {
    Case A.
  }
  @case (caseB) {
    Case B.
  }
  @default {
    Default case.
  }
}
`,
  },
];
