import type { CullTuple } from "./types";

type PartialParametersRight<TFn extends (...args: any[]) => any> =
  Parameters<TFn> extends infer TParams
    ? TParams extends [any, ...infer TTail]
      ? TParams | PartialParametersRight<(...args: TTail) => ReturnType<TFn>>
      : never
    : never;

type RemovedParametersRight<
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParametersRight<TFn>
> = CullTuple<Parameters<TFn>, TPartialArgs>;

export const partialRight = <
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParametersRight<TFn>
>(
  fn: TFn,
  ...args: TPartialArgs
): ((
  ...args: RemovedParametersRight<TFn, TPartialArgs>
) => ReturnType<TFn>) => {
  return (...args2) => fn(...args2, ...(args as any[]));
};
