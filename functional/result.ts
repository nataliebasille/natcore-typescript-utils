export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'value' in value &&
  (value.type === 'ok' || value.type === 'error');

type ResultMatchers<S, E, KV, EV> = {
  ok: (value: S) => KV;
  error: (value: E) => EV;
};

export function match<S, E, KV, EV>(
  matchers: ResultMatchers<S, E, KV, EV>,
): (result: Result<S, E>) => KV | EV;
export function match<R extends Result<unknown, unknown>, KV, EV>(
  result: R,
  matchers: ResultMatchers<Result_InferOK<R>, Result_InferError<R>, KV, EV>,
): KV | EV;
export function match(
  resultOrMatchers:
    | Result<unknown, unknown>
    | ResultMatchers<unknown, unknown, unknown, unknown>,
  matchers?: ResultMatchers<unknown, unknown, unknown, unknown>,
) {
  if ('ok' in resultOrMatchers) {
    return (result: Result<unknown, unknown>) =>
      match(result, resultOrMatchers);
  }

  return isOk(resultOrMatchers)
    ? matchers!.ok(resultOrMatchers.value)
    : matchers!.error(resultOrMatchers.value);
}

function createResult<S, E>({
  type,
  value,
}:
  | {
      type: 'ok';
      value: S;
    }
  | {
      type: 'error';
      value: E;
    }): Result<S, E> {
  const result = {
    type,
    value,
  } as Result<S, E>;

  return result;
}
