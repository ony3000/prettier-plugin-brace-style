import { format, baseOptions } from '../../settings';
import { switchCode, switchCodeWithBlock } from '../fixtures';
import { switchCodeResult, switchCodeWithBlockResult } from './expected-results';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

describe('[babel] stroustrup - switch statements', () => {
  test('switch', () => {
    expect(format(switchCode, options)).toBe(switchCodeResult);
  });

  test('switch (case with block)', () => {
    expect(format(switchCodeWithBlock, options)).toBe(switchCodeWithBlockResult);
  });
});
