import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'global augmentation',
    input: `
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
`,
  },
];
