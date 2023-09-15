// eslint-disable-next-line import/no-extraneous-dependencies
import { diff } from 'jest-diff';
import { format as v2Format } from 'prettier';

import { formatSync as v3Format } from '@/adaptors/prettier3';
import { braceStylePlugin as v2Plugin } from '@/v2-plugin';
import { braceStylePlugin as v3Plugin } from '@/v3-plugin';

const format = process.env.PRETTIER_VERSION === '2' ? v2Format : v3Format;
const plugin = process.env.PRETTIER_VERSION === '2' ? v2Plugin : v3Plugin;

function toBeFormattedAs(actual: any, expectedOutput: unknown) {
  // TODO: add a type guard for `actual`.

  const { input, options } = actual;

  const combinedOptions = { ...options, plugins: [plugin] };
  const formattedText = format(input, combinedOptions);

  const pass = formattedText === expectedOutput;

  return {
    pass,
    message: pass
      ? // @ts-ignore
        () => `Expected: not ${this.utils.printExpected(expectedOutput)}`
      : () => String(diff(String(expectedOutput), formattedText, { includeChangeCounts: true })),
  };
}

interface CustomMatchers<R = unknown> {
  toBeFormattedAs(output: string): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

export { toBeFormattedAs };
