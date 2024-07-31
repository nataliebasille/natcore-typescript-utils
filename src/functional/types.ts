/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Returns a type where the elements of `TTuple` that are in `TPartial`
 * and in the same order are removed.
 *
 * @example type CullTuple<[1, 2, 3, 4], [1, 3]> = [2, 4]
 * @example type CullTuple<[1, 2, 3, 4], [3, 1]> = [1, 2, 4]
 */
export type CullTuple<
  TTuple extends any[],
  TPartial extends any[],
> = TTuple extends [infer THead, ...infer TTail]
  ? TPartial extends [THead, ...infer TPartialTail]
    ? CullTuple<TTail, TPartialTail>
    : [THead, ...CullTuple<TTail, TPartial>]
  : [];
