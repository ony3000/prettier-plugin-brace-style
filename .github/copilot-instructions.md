# Copilot Instructions

## Commands

```bash
pnpm build          # Minified production build (esbuild, src/index.ts → dist/)
pnpm build:plain    # Non-minified build for development
pnpm test           # Run all tests with Vitest
pnpm lint           # Lint src/ and tests/ with Biome
```

**Run a single test file:**
```bash
pnpm test tests/babel/if/1tbs.test.ts
```

## Architecture

This is a Prettier plugin that enforces ESLint's `brace-style` rule (`1tbs`, `stroustrup`, `allman`) across 13+ parsers (Babel, TypeScript, HTML, CSS, Vue, Svelte, Astro, Oxc, etc.).

**Two-pass approach:**
1. Format code with Prettier's native parser first
2. Walk the resulting AST to identify target braces, then manipulate the formatted text line-by-line to reposition them

**Data flow through `src/`:**
```
src/index.ts         → exports options, parsers, printers
src/parsers.ts       → wraps Prettier's native parsers; orchestrates the two passes
src/options.ts       → defines the braceStyle plugin option schema
src/printers.ts      → emits the final transformed text from the custom AST
src/core-parts/
  parser.ts          → calls Prettier, handles Svelte AST refinement
  finder.ts          → language-specific AST walkers that locate target braces
  processor.ts       → line-by-line text transformation (splits/joins lines per brace style)
  utils.ts           → shared types, BraceType enum, Zod validators, constants
```

The output of the whole pipeline is a `FormattedTextAST` (`{ type: 'FormattedText', body: string }`) — a trivially simple AST that the custom printer emits as-is.

## Key Conventions

**Types (defined in `global.d.ts`):**
- `ResolvedOptions` = `ParserOptions & ThisPluginOptions` — passed everywhere
- `FormattedTextAST` — the single AST node the custom printer handles
- `SupportedParserNames` — union of all 13 supported parser name strings

**`BraceType` enum (in `utils.ts`):**
- `OB` = opening brace
- `OBTO` = opening brace inside a ternary operator; when split to its own line (allman style), it gets `indentLevel + 1` for visual nesting
- `OBNT` = opening brace that is not a transformation target (excluded from line-break insertion)
- `CB` = closing brace that may be followed by a connecting keyword (`else`, `catch`, `finally`, etc.) — a line break is inserted after it in stroustrup/allman
- `CBNT` = closing brace with no following connecting keyword, or one that must stay on the same line as what follows (e.g., `do...while`'s `}` before `while`) — excluded from line-break insertion

**CB vs CBNT assignment rule:** Generally, assign `CBNT` when no connecting keyword follows the closing brace. `DoWhileStatement` body is an exception — its `}` must stay with `while (...)`, so it uses `CBNT` even though `BlockStatement` nodes normally use `CB`. The same rule applies to Angular control flow blocks: `@if`, `@for`, `@else if`, `@defer`, etc. use `CB` (a sibling block can follow), while `@else`, `@switch`, `@case`, `@default`, `@error`, `@empty` use `CBNT`.

**Per-style transformation (`processor.ts`):**
- `1tbs` — no transformation; Prettier's output is used as-is
- `stroustrup` — calls `splitLineContainingClosingBrace` only: inserts a line break after each `CB` (e.g., `} else {` → `}\nelse {`)
- `allman` — calls both `splitLineContainingClosingBrace` and `splitLineContainingOpeningBrace`: additionally moves each `OB`/`OBTO` to its own line before the block

**Finder naming:** `handle{Language}{ASTNodeType}` (e.g., `handleJavaScriptBlockStatement`, `handleTypeScriptTSEnumDeclaration`)

**Range tuples:** brace positions are tracked as `[startOffset, endOffset]` character index pairs (`NodeRange` type).

**Zod for runtime validation:** All external inputs (plugin options, parser results) are validated with `z.object({...}).safeParse(arg).success` before use.

**Biome is the linter** (formatting disabled in `biome.json`); Prettier handles formatting of this repo's source files (configured via `.prettierrc.json`) and is also used inside test logic.

**Parser-specific AST differences:**
- `babel`/`babel-ts` top-level node type is `File`; `oxc` uses `Program`. Both use `handleJavaScriptFile` logic (collecting prettier-ignore comments), just registered under different node type keys.
- `babel-ts` represents enums with a `TSEnumBody` node (handled as a generic BlockStatement), while `typescript` uses `TSEnumDeclaration` (handled by a dedicated handler that computes the brace offset from the declaration text).
- `JSXText` nodes are intentionally excluded from `nonCommentNodes` in `findTargetBraceNodesBasedOnJavaScript` to prevent false positives in prettier-ignore range detection inside `filterAndSortBraceNodes`.

**Svelte AST refinement (`parser.ts`):** `prettier-plugin-svelte` internally base64-encodes `<script>` content during preprocessing. `refineSvelteAst` decodes this and restores AST node offsets so that TypeScript code inside `<script>` tags is correctly located for brace transformation. This refinement is not tied to a specific `prettier-plugin-svelte` version.

**CRLF handling:** Internal processing always uses `lf` (forced via `endOfLine: 'lf'` in the format call). Prettier's own pipeline handles CRLF restoration for the final output when `endOfLine: 'crlf'` is configured.

**Deprecated markdown/mdx support:** `parsers.ts` contains a code path for `parentParser === 'markdown'` or `'mdx'` (handling embedded code blocks). This path is deprecated and will be removed in v0.12.0, along with `tests/markdown/`.

## Test Structure

Tests live in `tests/{parser}/{feature}/` (e.g., `tests/babel/if/`, `tests/typescript/try/`).

Each feature directory contains:
- `fixtures.ts` — array of `Fixture` objects (input code snippets). The `output` field on the `Fixture` type is a legacy remnant from before snapshot tests were adopted and is not currently used; all fixture files use `Omit<Fixture, 'output'>[]`.
- `1tbs.test.ts`, `stroustrup.test.ts`, `allman.test.ts` — one file per brace style

**Babel parser tests** run two checks per fixture:
1. **Theoretical** — formats with the plugin, then runs ESLint's `brace-style` rule and asserts 0 errors
2. **Practical** — formats with the plugin and matches a Vitest snapshot

All other parsers (TypeScript, HTML, CSS, Vue, Svelte, Astro, Oxc, etc.) only run the **practical** (snapshot) check — no ESLint validation.

ESLint linter instances for each style are shared from `tests/linters.ts`. Base Prettier options are in `tests/settings.ts`.

**`issue-{number}` directories** (e.g., `tests/babel/issue-25/`) contain regression tests for specific GitHub issues.
