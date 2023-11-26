export type Result<S, E> = (
  | {
      readonly type: 'ok';
      readonly value: S;
    }
  | {
      readonly type: 'error';
      readonly value: E;
    }
) & { readonly _generic?: [S, E] };

export type Ok<S, E> = Extract<Result<S, E>, { type: 'ok' }>;
export type Error<S, E> = Extract<Result<S, E>, { type: 'error' }>;

export type Result_InferOK<R extends Result<unknown, unknown>> = R extends Ok<
  infer S,
  unknown
>
  ? S
  : R extends Error<infer S, unknown>
  ? S
  : R extends Result<infer S, unknown>
  ? S
  : never;

export type Result_InferError<R extends Result<unknown, unknown>> =
  R extends Ok<unknown, infer E>
    ? E
    : R extends Error<unknown, infer E>
    ? E
    : R extends Result<unknown, infer E>
    ? E
    : never;

export function ok<S, E = unknown>(value: S) {
  return createResult<S, E>({ type: 'ok', value });
}

export function error<S, E>(value: E) {
  return createResult<S, E>({ type: 'error', value });
}

export const isOk = <S, E>(result: Result<S, E>): result is Ok<S, E> =>
  result.type === 'ok';

export const isError = <S, E>(result: Result<S, E>): result is Error<S, E> =>
  result.type === 'error';

export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'value' in value &&
  (value.type === 'ok' || value.type === 'error');

export function from<R extends Result<unknown, unknown>>(): {
  ok: (value: Result_InferOK<R>) => Ok<Result_InferOK<R>, Result_InferError<R>>;
  error: (
    value: Result_InferError<R>,
  ) => Error<Result_InferOK<R>, Result_InferError<R>>;
};
export function from<R extends Result<unknown, unknown>>(
  prev: R,
): {
  ok: <S>(value: S) => Ok<S, Result_InferError<R>>;
  error: <E>(value: E) => Error<Result_InferOK<R>, E>;
};
export function from<S, E>(): {
  ok: (value: S) => Ok<S, E>;
  error: (value: E) => Error<S, E>;
};

export function from() {
  return {
    ok: (value: unknown) => ok(value),
    error: (value: unknown) => error(value),
  };
}

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

export function flatMap<S1, S2, E2>(
  fn: (value: S1) => Result<S2, E2>,
): <E1>(result: Result<S1, E1>) => Result<S2, E1 | E2>;
export function flatMap<
  R extends Result<unknown, unknown>,
  N extends Result<unknown, unknown>,
>(
  result: R,
  fn: (value: Result_InferOK<R>) => N,
): Result<Result_InferOK<N>, Result_InferError<R> | Result_InferError<N>>;

export function flatMap(
  resultOrFn:
    | Result<unknown, unknown>
    | ((value: unknown) => Result<unknown, unknown>),
  fn?: (value: unknown) => Result<unknown, unknown>,
) {
  if (typeof resultOrFn === 'function') {
    return (result: Result<unknown, unknown>) => flatMap(result, resultOrFn);
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
