import { error } from '../factories';
import {
  type Result_InferOK,
  type Result,
  type Result_InferError,
  type Result_Ok,
  type Result_Error,
} from '../types';
import { isError } from './isError';

type MapErrorInferNextResult<In extends Result<unknown, unknown>, Out> = [
  In,
] extends [Result_Ok<unknown>]
  ? In
  : [In] extends [Result_Error<unknown>]
  ? Result_Error<Out>
  : Result<Result_InferOK<In>, Out>;

export function mapError<In extends Result<unknown, unknown>, Out>(
  fn: (error: Result_InferError<In>) => Out,
): (result: In) => MapErrorInferNextResult<In, Out>;
export function mapError<In extends Result<unknown, unknown>, Out>(
  result: In,
  fn: (error: Result_InferError<In>) => Out,
): MapErrorInferNextResult<In, Out>;
export function mapError(
  resultOrFn: Result<unknown, unknown> | ((value: unknown) => unknown),
  fn?: (value: unknown) => unknown,
) {
  if (typeof resultOrFn === 'function') {
    return (result: Result<unknown, unknown>) => mapError(result, resultOrFn);
  }

  return (
    isError(resultOrFn) ? error(fn!(resultOrFn.value)) : resultOrFn
  ) as Result<unknown, unknown>;
}
