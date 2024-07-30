import {
  type Result_Error,
  type Result_Ok,
  type Result,
  type Result_InferError,
  type Result_InferOK,
} from '../types';
import { isOk } from './isOk';

type ResultMatchers<In extends Result<unknown, unknown>, KV, EV> = {
  ok: (value: Result_InferOK<In>) => KV;
  error: (value: Result_InferError<In>) => EV;
};

type MatchInferNextResult<R extends Result<unknown, unknown>, KV, EV> = [
  R,
] extends [Result_Ok<unknown>]
  ? KV
  : [R] extends [Result_Error<unknown>]
  ? EV
  : KV | EV;

export function match<In extends Result<unknown, unknown>, KV, EV>(
  matchers: ResultMatchers<In, KV, EV>,
): (result: In) => MatchInferNextResult<In, KV, EV>;
export function match<In extends Result<unknown, unknown>, KV, EV>(
  result: In,
  matchers: ResultMatchers<In, KV, EV>,
): MatchInferNextResult<In, KV, EV>;
export function match(
  resultOrMatchers:
    | Result<unknown, unknown>
    | ResultMatchers<Result<unknown, unknown>, unknown, unknown>,
  matchers?: ResultMatchers<Result<unknown, unknown>, unknown, unknown>,
) {
  if ('ok' in resultOrMatchers) {
    return (result: Result<unknown, unknown>) =>
      match(result, resultOrMatchers);
  }

  return isOk(resultOrMatchers)
    ? matchers!.ok(resultOrMatchers.value)
    : matchers!.error(resultOrMatchers.value);
}
