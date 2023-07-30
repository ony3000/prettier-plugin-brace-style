import { format, baseOptions } from '../../settings';
import { variableDeclarationCodeContainingOnlyCommentsInBrackets } from '../fixtures';
import { variableDeclarationCodeContainingOnlyCommentsInBracketsResult } from './expected-results';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

describe('[typescript] allman - other statements', () => {
  test('variable declaration (containing only comments in brackets)', () => {
    expect(format(variableDeclarationCodeContainingOnlyCommentsInBrackets, options)).toBe(
      variableDeclarationCodeContainingOnlyCommentsInBracketsResult,
    );
  });
});
