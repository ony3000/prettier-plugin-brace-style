export enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

export type Dict<T = unknown> = Record<string, T | undefined>;

export type NodeRange = [number, number];

export type BraceNode = {
  type: BraceType;
  range: NodeRange;
};
