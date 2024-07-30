import {
  type Result_Error,
  type Result_InferError,
  type Result_InferOK,
  type Result,
  type Result_Ok,
} from '../types';
import { isOk } from './isOk';

type AndThenInferNextResult<
  In extends Result<unknown, unknown>,
  Out extends Result<unknown, unknown>,
> = [In] extends [Result_Ok<unknown>]
  ? Out
  : [In] extends [Result_Error<unknown>]
  ? In
  : [Out] extends [Result_Ok<unknown>]
  ? Result<Result_InferOK<Out>, Result_InferError<In> | Result_InferError<Out>>
  : [Out] extends [Result_Error<unknown>]
  ? Result_Error<Result_InferError<In> | Result_InferError<Out>>
  : Result<Result_InferOK<Out>, Result_InferError<In> | Result_InferError<Out>>;

export function andThen<
  In extends Result<unknown, unknown>,
  Out extends Result<unknown, unknown>,
>(
  fn: (value: Result_InferOK<In>) => Out,
): (result: In) => AndThenInferNextResult<In, Out>;

export function andThen<
  In extends Result<unknown, unknown>,
  Out extends Result<unknown, unknown>,
>(
  result: In,
  fn: (value: Result_InferOK<In>) => Out,
): AndThenInferNextResult<In, Out>;

export function andThen(
  resultOrFn:
    | Result<unknown, unknown>
    | ((value: unknown) => Result<unknown, unknown>),
  fn?: (value: unknown) => Result<unknown, unknown>,
) {
  if (typeof resultOrFn === 'function') {
    return (result: Result<unknown, unknown>) => andThen(result, resultOrFn);
  }

  return isOk(resultOrFn) ? fn!(resultOrFn.value) : resultOrFn;
}
