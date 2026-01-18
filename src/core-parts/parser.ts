import type { AST, Parser } from 'prettier';
import { z } from 'zod';

import { EOL, isTypeof } from './utils';

function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

function refineSvelteAst(preprocessedText: string, ast: AST) {
  if (!ast.instance) {
    return ast;
  }

  const scriptTag = preprocessedText.slice(ast.instance.start, ast.instance.end);
  const matchResult = scriptTag.match(/ ✂prettier:content✂="([^"]+)"/);

  if (matchResult === null) {
    return ast;
  }

  const [temporaryAttributeWithLeadingSpace, encodedContent] = matchResult;
  const plainContent = base64Decode(encodedContent);

  const restoreOffset =
    plainContent.length - (temporaryAttributeWithLeadingSpace.length + '{}'.length);

  function recursion(node: unknown): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode);
        });
        return;
      }

      recursion(value);
    });

    if (
      !isTypeof(
        node,
        z.object({
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    if (ast.instance.end <= node.start) {
      node.start += restoreOffset;
    }
    if (ast.instance.end <= node.end) {
      node.end += restoreOffset;
    }
  }

  recursion(ast.html);

  ast.instance = {
    type: 'RefinedScript',
    start: ast.instance.start,
    end: ast.instance.end + restoreOffset,
    loc: {
      start: {
        line: preprocessedText.slice(0, ast.instance.start).split(EOL).length,
      },
    },
    content: {
      type: 'RefinedScriptSource',
      start: ast.instance.end + restoreOffset - ('</script>'.length + plainContent.length),
      end: ast.instance.end + restoreOffset - '</script>'.length,
      loc: {
        start: {
          line: ast.instance.content.body[0].loc.start.line,
        },
      },
      value: plainContent,
    },
  };

  return ast;
}

export async function advancedParse(
  text: string,
  parserName: SupportedParserNames,
  defaultParser: Parser,
  options: ResolvedOptions,
): Promise<AST> {
  const preprocessedText = await (defaultParser.preprocess
    ? defaultParser.preprocess(text, options)
    : text);
  let ast = await defaultParser.parse(preprocessedText, options);

  if (parserName === 'svelte') {
    ast = refineSvelteAst(preprocessedText, ast);
  }

  return ast;
}
