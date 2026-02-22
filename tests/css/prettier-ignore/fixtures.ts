import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `
/* prettier-ignore */
#blue { background-color: skyblue; }
`,
  },
  {
    name: 'ignore comment (2)',
    input: `
@keyframes slide-and-fade {
  /* prettier-ignore */
  from { transform: translateX(0); opacity: 0; }
  50% { opacity: 1; }
  to { transform: translateX(50vw); opacity: 0; }
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting',
    input: `
/**
 * prettier-ignore
 */
h1, h2, h3, h4, h5, h6 {
  font-family: "Helvetica", "Arial";
}
`,
  },
];
