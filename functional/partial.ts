import { CullTuple } from "./types";

type PartialParameters<TFn extends (...args: any[]) => any> =
  Parameters<TFn> extends infer TParams
    ? TParams extends [...infer THead, any]
      ? TParams | PartialParameters<(...args: THead) => ReturnType<TFn>>
      : never
    : never;

type RemovePartialParameters<
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParameters<TFn>
> = CullTuple<Parameters<TFn>, TPartialArgs>;

export const partial = <
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParameters<TFn>
>(
  fn: TFn,
  ...args: TPartialArgs
): ((
  ...args: RemovePartialParameters<TFn, TPartialArgs>
) => ReturnType<TFn>) => {
  return (...args2) => fn(...(args as any[]), ...args2);
};
