/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CullTuple } from './types';

type PartialParametersRight<TFn extends (...args: any[]) => any> =
  Parameters<TFn> extends infer TParams
    ? TParams extends [any, ...infer TTail]
      ? TParams | PartialParametersRight<(...args: TTail) => ReturnType<TFn>>
      : never
    : never;

type RemovedParametersRight<
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParametersRight<TFn>,
> = CullTuple<Parameters<TFn>, TPartialArgs>;

/**
 * Partially applies arguments to a function from the right.
 *
 * @param fn - The function to partially apply arguments to.
 * @param args - The arguments to partially apply.
 * @returns - A function that takes the remaining arguments and returns the result of calling fn with the partially applied arguments.
 */
export const partialRight = <
  TFn extends (...args: any[]) => any,
  TPartialArgs extends PartialParametersRight<TFn>,
>(
  fn: TFn,
  ...args: TPartialArgs
): ((
  ...args: RemovedParametersRight<TFn, TPartialArgs>
) => ReturnType<TFn>) => {
  return (...args2) => fn(...args2, ...(args as any[]));
};
