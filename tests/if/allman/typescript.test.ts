import { format, baseOptions } from '../../settings';
import {
  ifCode,
  ifElseCode,
  ifElseifElseCode,
  ifElseCodeWithComment,
  ifCode1,
  ifCode2,
  ifCode3,
  ifCode4,
  ifElseifElseCode1,
  nestedIfCode1,
} from '../fixtures';
import {
  ifCodeResult,
  ifElseCodeResult,
  ifElseifElseCodeResult,
  ifElseCodeWithCommentResult,
  ifCode1Result,
  ifCode2Result,
  ifCode3Result,
  ifCode4Result,
  ifElseifElseCode1Result,
  nestedIfCode1Result,
} from './expected-results';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

describe('[typescript] allman - if statements', () => {
  test('if', () => {
    expect(format(ifCode, options)).toBe(ifCodeResult);
  });

  test('if...else', () => {
    expect(format(ifElseCode, options)).toBe(ifElseCodeResult);
  });

  test('if...elseif...else', () => {
    expect(format(ifElseifElseCode, options)).toBe(ifElseifElseCodeResult);
  });

  test('if...else (with comment)', () => {
    expect(format(ifElseCodeWithComment, options)).toBe(ifElseCodeWithCommentResult);
  });

  test('if (containing only comments in brackets #1)', () => {
    expect(format(ifCode1, options)).toBe(ifCode1Result);
  });

  test('if (containing only comments in brackets #2)', () => {
    expect(format(ifCode2, options)).toBe(ifCode2Result);
  });

  test('if (containing only comments in brackets #3)', () => {
    expect(format(ifCode3, options)).toBe(ifCode3Result);
  });

  test('if (containing only comments in brackets #4)', () => {
    expect(format(ifCode4, options)).toBe(ifCode4Result);
  });

  test('if...elseif...else (containing only comments in brackets)', () => {
    expect(format(ifElseifElseCode1, options)).toBe(ifElseifElseCode1Result);
  });

  test('nested if (containing only comments in brackets)', () => {
    expect(format(nestedIfCode1, options)).toBe(nestedIfCode1Result);
  });
});
