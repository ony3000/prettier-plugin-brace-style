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
- `OB` = opening brace, `CB` = closing brace
- `OBTO` = ternary operator (treated specially)
- `OBNT` / `CBNT` = not a target (excluded from transformation)

**Finder naming:** `handle{Language}{ASTNodeType}` (e.g., `handleJavaScriptBlockStatement`, `handleTypeScriptTSEnumDeclaration`)

**Range tuples:** brace positions are tracked as `[startOffset, endOffset]` character index pairs (`NodeRange` type).

**Zod for runtime validation:** All external inputs (plugin options, parser results) are validated with `z.object({...}).safeParse(arg).success` before use.

**Biome is the linter** (formatting disabled in `biome.json`); Prettier handles formatting of this repo's source files (configured via `.prettierrc.json`) and is also used inside test logic.

## Test Structure

Tests live in `tests/{parser}/{feature}/` (e.g., `tests/babel/if/`, `tests/typescript/try/`).

Each feature directory contains:
- `fixtures.ts` — array of `Fixture` objects (input code snippets)
- `1tbs.test.ts`, `stroustrup.test.ts`, `allman.test.ts` — one file per brace style

**Babel parser tests** run two checks per fixture:
1. **Theoretical** — formats with the plugin, then runs ESLint's `brace-style` rule and asserts 0 errors
2. **Practical** — formats with the plugin and matches a Vitest snapshot

All other parsers (TypeScript, HTML, CSS, Vue, Svelte, Astro, Oxc, etc.) only run the **practical** (snapshot) check — no ESLint validation.

ESLint linter instances for each style are shared from `tests/linters.ts`. Base Prettier options are in `tests/settings.ts`.
