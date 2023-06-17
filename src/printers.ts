import type { AstPath, ParserOptions, Doc, Printer } from 'prettier';
import { doc } from 'prettier';

import { extractPrinter, makeCommentContext } from './utils';

const { hardline } = doc.builders;

const printerErrorMessage =
  'There is no default printer or the function to look for does not exist.';

let defaultPrinter: Printer | undefined;

function typescriptPrint(
  path: AstPath,
  options: ParserOptions,
  print: (path: AstPath) => Doc,
): Doc {
  const node = path.getValue();

  if (!defaultPrinter && node && node.type === 'Program') {
    defaultPrinter = extractPrinter(options);
  }

  if (!defaultPrinter) {
    throw new Error('Default printer does not exist.');
  }

  const defaultDoc = defaultPrinter.print(path, options, print);

  if (node) {
    switch (node.type) {
      case 'BlockStatement': {
        const parentNode = path.getParentNode();
        const refinedDoc = (defaultDoc as Doc[]).slice();

        // @ts-ignore
        if (options.braceStyle === 'allman' && parentNode.type !== 'SwitchCase') {
          refinedDoc.unshift(hardline);
        }

        return refinedDoc;
      }
      case 'IfStatement': {
        const refinedDoc = (defaultDoc as Doc[]).slice();

        // @ts-ignore
        if (options.braceStyle === 'stroustrup' || options.braceStyle === 'allman') {
          refinedDoc.forEach((docItem, index, array) => {
            if (docItem === 'else') {
              // eslint-disable-next-line no-param-reassign
              array[index - 1] = hardline;
            }
          });
        }

        return refinedDoc;
      }
      case 'SwitchStatement':
      case 'StaticBlock': {
        const refinedDoc = (defaultDoc as Doc[]).slice();

        // @ts-ignore
        if (options.braceStyle === 'allman') {
          refinedDoc.splice(1, 1, hardline, '{');
        }

        return refinedDoc;
      }
      case 'TryStatement': {
        const refinedDoc = (defaultDoc as Doc[]).slice();

        // @ts-ignore
        if (options.braceStyle === 'stroustrup' || options.braceStyle === 'allman') {
          refinedDoc.forEach((docItem) => {
            if (Array.isArray(docItem)) {
              const [firstDoc, secondDoc] = docItem;

              if (typeof firstDoc === 'string' && Array.isArray(secondDoc)) {
                const matchResult = firstDoc.match(/(finally.*)/);

                if (matchResult) {
                  docItem.splice(0, 1, hardline, matchResult[1]);
                } else {
                  // catch clause
                  docItem.splice(0, 1, hardline);
                }
              }
            }
          });
        }

        return refinedDoc;
      }
      case 'ClassBody': {
        const refinedDoc = (defaultDoc as Doc[]).slice();

        // @ts-ignore
        if (options.braceStyle === 'allman') {
          refinedDoc.unshift(hardline);
        }

        return refinedDoc;
      }
      default: {
        return defaultDoc;
      }
    }
  }

  return defaultDoc;
}

function canAttachComment(node: any): boolean {
  return node.type && node.type !== 'comment';
}

function isBlockCommentWrapper(node: any): boolean {
  if (defaultPrinter?.isBlockComment) {
    return defaultPrinter.isBlockComment(node);
  }

  throw new Error(`[isBlockCommentWrapper] ${printerErrorMessage}`);
}

function printCommentWrapper(commentPath: AstPath, options: ParserOptions): Doc {
  if (defaultPrinter?.printComment) {
    return defaultPrinter.printComment(commentPath, options);
  }

  throw new Error(`[printCommentWrapper] ${printerErrorMessage}`);
}

function ownLineWrapper(
  commentNode: any,
  text: string,
  options: ParserOptions,
  ast: any,
  isLastComment: boolean,
): boolean {
  if (!defaultPrinter && ast && ast.type === 'Program') {
    defaultPrinter = extractPrinter(options);
  }

  if (defaultPrinter?.handleComments?.ownLine) {
    const commentContext = makeCommentContext(commentNode, text, options, ast, isLastComment);

    return defaultPrinter.handleComments.ownLine(commentContext, text, options, ast, isLastComment);
  }

  throw new Error(`[ownLineWrapper] ${printerErrorMessage}`);
}

function endOfLineWrapper(
  commentNode: any,
  text: string,
  options: ParserOptions,
  ast: any,
  isLastComment: boolean,
): boolean {
  if (!defaultPrinter && ast && ast.type === 'Program') {
    defaultPrinter = extractPrinter(options);
  }

  if (defaultPrinter?.handleComments?.endOfLine) {
    const commentContext = makeCommentContext(commentNode, text, options, ast, isLastComment);

    return defaultPrinter.handleComments.endOfLine(
      commentContext,
      text,
      options,
      ast,
      isLastComment,
    );
  }

  throw new Error(`[endOfLineWrapper] ${printerErrorMessage}`);
}

function remainingWrapper(
  commentNode: any,
  text: string,
  options: ParserOptions,
  ast: any,
  isLastComment: boolean,
): boolean {
  if (!defaultPrinter && ast && ast.type === 'Program') {
    defaultPrinter = extractPrinter(options);
  }

  if (defaultPrinter?.handleComments?.remaining) {
    const commentContext = makeCommentContext(commentNode, text, options, ast, isLastComment);

    return defaultPrinter.handleComments.remaining(
      commentContext,
      text,
      options,
      ast,
      isLastComment,
    );
  }

  throw new Error(`[remainingWrapper] ${printerErrorMessage}`);
}

export const printers: { [astFormat: string]: Printer } = {
  'typescript-ast': {
    print: typescriptPrint,
    canAttachComment,
    isBlockComment: isBlockCommentWrapper,
    printComment: printCommentWrapper,
    handleComments: {
      ownLine: ownLineWrapper,
      endOfLine: endOfLineWrapper,
      remaining: remainingWrapper,
    },
  },
};
