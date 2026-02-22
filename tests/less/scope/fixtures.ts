import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'mixin scope features',
    input: `
#ns {
  @a: one;
  .mixin-1() {
    prop: @a;
  }
}
.rule {
  #ns.mixin-1();
}
`,
  },
];
