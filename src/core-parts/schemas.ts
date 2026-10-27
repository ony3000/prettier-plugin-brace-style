import { z } from 'zod';

import { type NodeRange, isTypeof } from './utils';

// Define schemas once so AST visits reuse schema instances and compiled parsers.

// Common AST structure.

export const nodeTypeSchema = z.object({ type: z.string() });

export const nodeRangeSchema = z.tuple([z.number(), z.number()]);

export const nodeWithRangeSchema = z.object({
  start: z.undefined().optional(),
  end: z.undefined().optional(),
  range: z.custom<NodeRange>((value) => isTypeof(value, nodeRangeSchema)),
});

export const nodeOffsetsSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const nodeKindSchema = z.object({ kind: z.string() });

// JavaScript, TypeScript, and JSX.

export const javaScriptFileSchema = z.object({
  comments: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
      start: z.number(),
      end: z.number(),
    }),
  ),
});

export const javaScriptSwitchStatementSchema = z.object({
  discriminant: z.object({
    start: z.number(),
    end: z.number(),
  }),
});

export const typeScriptBlockSchema = z.object({
  value: z.string(),
});

export const typeScriptTSEnumDeclarationSchema = z.object({
  id: z.object({
    name: z.string(),
  }),
  declare: z.boolean().optional(),
  const: z.boolean().optional(),
});

// HTML, Angular, and Vue.

export const htmlElementSchema = z.object({
  startSourceSpan: z.object({
    end: z.object({
      offset: z.number(),
    }),
  }),
  name: z.string(),
  children: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  attrs: z.array(
    z.object({
      name: z.string(),
      value: z.unknown().optional(),
    }),
  ),
});

export const angularAngularControlFlowBlockSchema = z.object({
  name: z.string(),
  startSourceSpan: z.object({
    end: z.object({
      offset: z.number(),
    }),
  }),
  endSourceSpan: z.object({
    start: z.object({
      offset: z.number(),
    }),
  }),
});

export const vueAttributeParentSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
});

export const vueAttributeSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  name: z.string(),
  value: z.string(),
  valueSpan: z.object({
    start: z.object({
      offset: z.number(),
    }),
    end: z.object({
      offset: z.number(),
    }),
  }),
});

export const vueElementSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  startSourceSpan: z.object({
    end: z.object({
      offset: z.number(),
    }),
  }),
  name: z.string(),
  children: z.array(
    z.object({
      value: z.string(),
    }),
  ),
});

export const htmlNodeSourceSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      offset: z.number(),
    }),
    end: z.object({
      offset: z.number(),
    }),
  }),
});

// Svelte.

export const svelteCommentSchema = z.object({
  data: z.string(),
});

export const svelteRefinedScriptSchema = z.object({
  content: z.object({
    start: z.number(),
    value: z.string(),
  }),
});

export const startLineLocationSchema = z.object({
  loc: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
});

export const endLineLocationSchema = z.object({
  loc: z.object({
    end: z.object({
      line: z.number(),
    }),
  }),
});

// CSS.

export const cssCssAtruleSchema = z.object({
  name: z.string(),
  nodes: z.array(z.unknown()),
  raws: z.object({
    afterName: z.string(),
    params: z.string(),
  }),
});

export const cssEmptyAtruleSchema = z.object({
  raws: z.object({
    value: z.literal(''),
  }),
});

export const cssCssCommentSchema = z.object({
  text: z.string(),
});

export const cssCssRuleSchema = z.object({
  raws: z.object({
    selector: z.string(),
  }),
});

export const cssNodeSourceSchema = z.object({
  source: z.object({
    startOffset: z.number(),
    endOffset: z.number(),
  }),
});

// Astro.

export const astroFrontmatterSchema = z.object({
  value: z.string(),
});

export const astroElementSchema = z.object({
  name: z.literal('script'),
  attributes: z.array(
    z.object({
      type: z.literal('attribute'),
      kind: z.string(),
      name: z.string(),
      raw: z.string(),
    }),
  ),
  children: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    }),
  ),
});

export const astroCommentSchema = z.object({
  value: z.string(),
});

export const astroNodePositionSchema = z.object({
  position: z.object({
    start: z.object({
      offset: z.number(),
    }),
    end: z
      .object({
        offset: z.number(),
      })
      .optional(),
  }),
  name: z.unknown().optional(),
  value: z.unknown().optional(),
});
