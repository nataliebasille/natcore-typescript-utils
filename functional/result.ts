export const isError = <R extends Result<unknown, unknown>>(
  result: R,
): result is Extract<R, Result_Error<unknown>> => result.type === 'error';

export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'value' in value &&
  (value.type === 'ok' || value.type === 'error');

export function map<S, N>(
  fn: (value: S) => N,
): <E>(result: Result<S, E>) => Result<N, E>;
export function map<R extends Result<unknown, unknown>, N>(
  result: R,
  fn: (value: Result_InferOK<R>) => N,
): Result<N, Result_InferError<R>>;
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

export function andThen<
  R1 extends Result<unknown, unknown>,
  R2 extends Result<unknown, unknown>,
>(
  fn: (value: Result_InferOK<R1>) => R2,
): (
  result: R1,
) => Result<Result_InferOK<R2>, Result_InferError<R1> | Result_InferError<R2>>;
export function andThen<
  R extends Result<unknown, unknown>,
  N extends Result<unknown, unknown>,
>(
  result: R,
  fn: (value: Result_InferOK<R>) => N,
): Result<Result_InferOK<N>, Result_InferError<R> | Result_InferError<N>>;
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
