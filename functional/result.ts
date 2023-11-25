export type Result<S, E> = (
  | {
      readonly type: 'ok';
      readonly value: S;
    }
  | {
      readonly type: 'error';
      readonly value: E;
    }
) & {
  map: <N>(fn: (value: S) => N) => Result<N, E>;
  flatMap: <N>(fn: (value: S) => Result<N, E>) => Result<N, E>;
  match: <KR, ER>(matchers: ResultMatchers<S, E, KR, ER>) => KR | ER;
};

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

export const ok = <S>(value: S) => createResult<S, never>('ok', value);
export const error = <E>(value: E) => createResult<never, E>('error', value);

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

function createResult<S, E>(type: 'ok' | 'error', value: S | E): Result<S, E> {
  return {
    type,
    value,
    map: <N>(fn: (value: S) => N) => map(fn)(createResult(type, value)),
    flatMap: <N>(fn: (value: S) => Result<N, E>) =>
      flatMap(fn)(createResult(type, value)),
    match: <KV, EV>(matchers: ResultMatchers<S, E, KV, EV>) =>
      match(matchers)(createResult(type, value)),
  } as Result<S, E>;
}
