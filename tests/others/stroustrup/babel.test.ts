import { format, baseOptions } from '../../settings';
import {
  variableDeclarationCode1,
  variableDeclarationCode2,
  variableDeclarationCode3,
  variableDeclarationCode4,
} from '../fixtures';
import {
  variableDeclarationCode1Result,
  variableDeclarationCode2Result,
  variableDeclarationCode3Result,
  variableDeclarationCode4Result,
} from './expected-results';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

describe('[babel] stroustrup - other statements', () => {
  test('variable declaration (containing only comments in brackets #1)', () => {
    expect(format(variableDeclarationCode1, options)).toBe(variableDeclarationCode1Result);
  });

  test('variable declaration (containing only comments in brackets #2)', () => {
    expect(format(variableDeclarationCode2, options)).toBe(variableDeclarationCode2Result);
  });

  test('variable declaration (containing only comments in brackets #3)', () => {
    expect(format(variableDeclarationCode3, options)).toBe(variableDeclarationCode3Result);
  });

  test('variable declaration (containing only comments in brackets #4)', () => {
    expect(format(variableDeclarationCode4, options)).toBe(variableDeclarationCode4Result);
  });
});
