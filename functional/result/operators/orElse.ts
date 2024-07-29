import {
  Result,
  Result_Error,
  Result_InferError,
  Result_InferOK,
  Result_Ok,
} from '../types';
import { isOk } from './isOk';

type OrElseInferNextResult<
  R extends Result<unknown, unknown>,
  N extends Result<unknown, unknown>,
> = [R] extends [Result_Ok<unknown>]
  ? R
  : [R] extends [Result_Error<unknown>]
  ? N
  : [N] extends [Result_Ok<unknown>]
  ? Result_Ok<Result_InferOK<N> | Result_InferOK<R>>
  : [N] extends [Result_Error<unknown>]
  ? Result<Result_InferOK<R>, Result_InferError<N>>
  : Result<Result_InferOK<R>, Result_InferError<R> | Result_InferError<N>>;

type X = OrElseInferNextResult<
  | Result_Ok<number>
  | Result_Error<{
      code: 1;
      message: string;
    }>,
  Result_Ok<string>
>;

export function orElse<
  R extends Result<unknown, unknown>,
  N extends Result<unknown, unknown>,
>(
  fn: (value: Result_InferError<R>) => N,
): (result: R) => OrElseInferNextResult<R, N>;

export function orElse<
  R extends Result<unknown, unknown>,
  N extends Result<unknown, unknown>,
>(
  result: R,
  fn: (value: Result_InferError<R>) => N,
): OrElseInferNextResult<R, N>;

export function orElse(
  resultOrFn:
    | Result<unknown, unknown>
    | ((value: unknown) => Result<unknown, unknown>),
  fn?: (value: unknown) => Result<unknown, unknown>,
): unknown {
  if (typeof resultOrFn === 'function') {
    return (result: Result<unknown, unknown>) => orElse(result, resultOrFn);
  }

  return isOk(resultOrFn) ? resultOrFn : fn!(resultOrFn.value);
}
