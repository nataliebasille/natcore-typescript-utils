/* eslint-disable @typescript-eslint/no-explicit-any */
import { CullTuple } from './types';

type PartialParameters<TFn extends (...args: any[]) => any> = Parameters<TFn> extends infer TParams
  ? TParams extends [...infer THead, any]
    ? TParams | PartialParameters<(...args: THead) => ReturnType<TFn>>
    : never
  : never;

type RemovePartialParameters<TFn extends (...args: any[]) => any, TPartialArgs extends PartialParameters<TFn>> = CullTuple<
  Parameters<TFn>,
  TPartialArgs
>;

/**
 * Partially applies arguments to a function from the left.
 *
 * @param fn - The function to partially apply arguments to.
 * @param args - The arguments to partially apply.
 * @returns A function that takes the remaining arguments and returns the result of calling fn with the partially applied arguments.
 */
export const partial = <TFn extends (...args: any[]) => any, TPartialArgs extends PartialParameters<TFn>>(
  fn: TFn,
  ...args: TPartialArgs
): ((...args: RemovePartialParameters<TFn, TPartialArgs>) => ReturnType<TFn>) => {
  return (...args2) => fn(...(args as any[]), ...args2);
};
