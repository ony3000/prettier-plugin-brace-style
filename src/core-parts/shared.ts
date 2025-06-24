import type { ZodTypeAny, infer as ZodInfer } from 'zod';

export enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

export type NodeRange = [number, number];

export type BraceNode = {
  type: BraceType;
  range: NodeRange;
};

export function isTypeof<T extends ZodTypeAny>(
  arg: unknown,
  expectedSchema: T,
): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}
