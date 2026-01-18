import type { ZodTypeAny, infer as ZodInfer } from 'zod';

export type NodeRange = [number, number];

export type BraceNode = {
  type: BraceType;
  range: NodeRange;
};

export enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

export const EOL = '\n';

export const SPACE = ' ';

export const TAB = '\t';

export function isTypeof<T extends ZodTypeAny>(
  arg: unknown,
  expectedSchema: T,
): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}
