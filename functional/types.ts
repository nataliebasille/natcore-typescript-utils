export type CullTuple<
  TTuple extends any[],
  TPartial extends any[]
> = TTuple extends [infer THead, ...infer TTail]
  ? TPartial extends [THead, ...infer TPartialTail]
    ? CullTuple<TTail, TPartialTail>
    : [THead, ...CullTuple<TTail, TPartial>]
  : [];
