import { parsers as oxcParsers } from '@prettier/plugin-oxc';
import type { AST, Parser, Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

import { parseLineByLineAndAssemble, refineSvelteAst } from './core-parts';

const EOL = '\n';

async function advancedParse(
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

function transformParser(
  parserName: SupportedParserNames,
  transformOptions:
    | {
        defaultParser: Parser;
        externalPluginName?: string;
      }
    | {
        defaultParser: null;
        externalPluginName: string;
      },
): Parser {
  const { defaultParser, externalPluginName } = transformOptions;
  let refinedParser = defaultParser;

  return {
    ...(refinedParser ?? {}),
    // @ts-expect-error
    parse: async (text: string, options: ResolvedOptions): Promise<FormattedTextAST> => {
      if (options.parentParser === 'markdown' || options.parentParser === 'mdx') {
        let codeblockStart = '```';
        const codeblockEnd = '```';

        if (options.parser === 'babel') {
          codeblockStart = '```jsx';
        } else if (options.parser === 'typescript') {
          codeblockStart = '```tsx';
        }

        const formattedCodeblock = await format(
          `${codeblockStart}${EOL}${text}${EOL}${codeblockEnd}`,
          {
            ...options,
            plugins: [],
            rangeEnd: Infinity,
            endOfLine: 'lf',
            parser: options.parentParser,
            parentParser: undefined,
          },
        );
        const formattedText = formattedCodeblock
          .trim()
          .slice(`${codeblockStart}${EOL}`.length, -`${EOL}${codeblockEnd}`.length);

        return {
          type: 'FormattedText',
          body: formattedText,
        };
      }

      const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];

      let externalPlugin: Plugin | undefined;
      let externalParser: Parser | undefined;

      if (externalPluginName) {
        externalPlugin = plugins
          .filter(
            (plugin) =>
              // @ts-expect-error: `name` is presumed to be injected internally by Prettier.
              plugin.name === externalPluginName,
          )
          .at(0);

        if (!externalPlugin) {
          throw new Error('There is no plugin with the given name.');
        }

        externalParser = externalPlugin.parsers?.[parserName];

        if (refinedParser === null) {
          if (!externalParser) {
            throw new Error('The plugin does not contain a parser.');
          }

          refinedParser = externalParser;
        }
      }

      if (refinedParser === null) {
        throw new Error('Could not find a suitable parser.');
      }

      const formattedText = await format(text, {
        ...options,
        plugins: externalPlugin ? [externalPlugin] : [],
        endOfLine: 'lf',
      });

      const ast = await advancedParse(formattedText, parserName, refinedParser, options);
      const result = parseLineByLineAndAssemble(formattedText, ast, options);

      return {
        type: 'FormattedText',
        body: result,
      };
    },
    astFormat: 'brace-style-ast',
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser('babel', {
    defaultParser: babelParsers.babel,
  }),
  typescript: transformParser('typescript', {
    defaultParser: typescriptParsers.typescript,
  }),
  angular: transformParser('angular', {
    defaultParser: htmlParsers.angular,
  }),
  html: transformParser('html', {
    defaultParser: htmlParsers.html,
  }),
  vue: transformParser('vue', {
    defaultParser: htmlParsers.vue,
  }),
  oxc: transformParser('oxc', {
    defaultParser: oxcParsers.oxc,
    externalPluginName: '@prettier/plugin-oxc',
  }),
  astro: transformParser('astro', {
    defaultParser: null,
    externalPluginName: 'prettier-plugin-astro',
  }),
  svelte: transformParser('svelte', {
    defaultParser: null,
    externalPluginName: 'prettier-plugin-svelte',
  }),
};
