import { ok } from '../factories';
import {
  type Result_InferOK,
  type Result,
  type Result_InferError,
  type Result_Ok,
  type Result_Error,
} from '../types';
import { isOk } from './isOk';

type MapInferNextResult<In extends Result<unknown, unknown>, Out> = [
  In,
] extends [Result_Ok<unknown>]
  ? Result_Ok<Out>
  : [In] extends [Result_Error<unknown>]
  ? In
  : Result<Out, Result_InferError<In>>;

export function map<In extends Result<unknown, unknown>, Out>(
  fn: (value: Result_InferOK<In>) => Out,
): (result: In) => MapInferNextResult<In, Out>;
export function map<In extends Result<unknown, unknown>, Out>(
  result: In,
  fn: (value: Result_InferOK<In>) => Out,
): MapInferNextResult<In, Out>;
export function map(
  resultOrFn: Result<unknown, unknown> | ((value: unknown) => unknown),
  fn?: (value: unknown) => unknown,
) {
  if (typeof resultOrFn === 'function') {
    return (result: Result<unknown, unknown>) => map(result, resultOrFn);
  }

  return (isOk(resultOrFn) ? ok(fn!(resultOrFn.value)) : resultOrFn) as Result<
    unknown,
    unknown
  >;
}
