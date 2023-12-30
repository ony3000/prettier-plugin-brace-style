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

export type NarrowedParserOptions = {
  tabWidth: number;
  useTabs: boolean;
  parser: string;
  braceStyle: '1tbs' | 'stroustrup' | 'allman';
};
